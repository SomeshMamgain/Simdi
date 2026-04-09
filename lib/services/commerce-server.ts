import 'server-only'

import crypto from 'node:crypto'

import { Client, Databases, Query, type Models } from 'node-appwrite'

import { FIXED_HANDLING_CHARGE_PERCENT, calculateCartTotals, getCartSubtotal, roundCurrency } from '@/lib/cart-helpers'
import { formatCurrencyAmount } from '@/lib/product-utils'
import { generateOrderNumber } from '@/lib/services/order-number-generator'
import { buildOrderCustomer, getAuthSessionPayload } from '@/lib/services/user-profile-server'
import type { CartItem } from '@/types/cart'
import {
  buildOrderItemFromCartItem,
  type CheckoutPricing,
  type DeliveryAddress,
  type OrderCustomer,
  type OrderItem,
  type OrderRecord,
  type OrderStatus,
  type PaymentStatus,
  type RefundStatus,
} from '@/types/order'
import type { AppliedPromo, PromoCode, PromoValidationResult } from '@/types/promo'

interface ServerCommerceConfig {
  endpoint: string
  projectId: string
  apiKey: string
  databaseId: string
  promoCollectionId?: string
  orderCollectionId?: string
  razorpayKeyId: string
  razorpaySecret: string
  storeName: string
}

type GenericRecord = Record<string, unknown>
type OrderDocument = Models.Document & GenericRecord

interface StoredOrderSnapshot {
  items: OrderItem[]
  subtotal: number
  promoDiscount: number
  handlingCharge: number
  handlingChargePercent: number
  total: number
  promoCode?: string | null
  customer?: OrderCustomer
  paymentMethod?: string
  paymentStatus?: PaymentStatus
  paymentDate?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  razorpaySignature?: string
}

interface CreateOrderRecordInput {
  checkoutReference: string
  items: CartItem[]
  pricing: CheckoutPricing
  customer?: OrderCustomer
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature?: string
  paymentMethod?: string
  paymentStatus?: PaymentStatus
  orderStatus?: OrderStatus
  type?: string
  notes?: string
}

interface UpdateOrderInput {
  status?: OrderStatus
  tracking_number?: string
  in_transit?: string
  out_for_delivery?: string
  delivered_date?: string
  admin_notes?: string
  notes?: string
  refund_status?: RefundStatus
  refund_amount?: number
  payment_status?: PaymentStatus
  type?: string
}

let orderCollectionAttributeCache: Promise<Set<string>> | null = null
let resolvedOrderCollectionIdCache: Promise<string> | null = null

function getEnvironmentValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]

    if (value) {
      return value
    }
  }

  return ''
}

function getCommerceConfig(options?: {
  requirePromo?: boolean
  requireOrders?: boolean
  requireRazorpay?: boolean
}): ServerCommerceConfig {
  const endpoint = getEnvironmentValue('NEXT_PUBLIC_APPWRITE_ENDPOINT')
  const projectId = getEnvironmentValue('NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  const apiKey = getEnvironmentValue('APPWRITE_API_KEY')
  const databaseId = getEnvironmentValue('NEXT_PUBLIC_APPWRITE_DATABASE_ID', 'NEXT_PUBLIC_APPWRITE_DB_ID', 'APPWRITE_DATABASE_ID')
  const promoCollectionId = getEnvironmentValue('NEXT_PUBLIC_APPWRITE_PROMO_COLLECTION_ID', 'APPWRITE_PROMO_COLLECTION_ID')
  const orderCollectionId = getEnvironmentValue(
    'NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID',
    'NEXT_PUBLIC_APPWRITE_COLLECTION_ID',
    'APPWRITE_ORDER_COLLECTION_ID',
    'APPWRITE_ORDERS_COLLECTION_ID',
    'APPWRITE_COLLECTION_ID'
  )
  const razorpayKeyId = getEnvironmentValue('RAZORPAY_KEY_ID', 'NEXT_PUBLIC_RAZORPAY_KEY_ID')
  const razorpaySecret = getEnvironmentValue('RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET')
  const storeName = getEnvironmentValue('NEXT_PUBLIC_STORE_NAME', 'APP_NAME', 'STORE_NAME') || 'Simdi'

  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT')
  }

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  }

  if (!apiKey) {
    throw new Error('Missing APPWRITE_API_KEY')
  }

  if (!databaseId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID')
  }

  if (options?.requirePromo && !promoCollectionId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROMO_COLLECTION_ID')
  }

  if (options?.requireRazorpay) {
    if (!razorpayKeyId) {
      throw new Error('Missing RAZORPAY_KEY_ID')
    }

    if (!razorpaySecret) {
      throw new Error('Missing RAZORPAY_KEY_SECRET')
    }
  }

  return {
    endpoint,
    projectId,
    apiKey,
    databaseId,
    promoCollectionId: promoCollectionId || undefined,
    orderCollectionId: orderCollectionId || undefined,
    razorpayKeyId,
    razorpaySecret,
    storeName,
  }
}

function createServerDatabasesClient() {
  const config = getCommerceConfig()

  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey)

  return new Databases(client)
}

async function resolveOrderCollectionId(databases: Databases, databaseId: string, preferredId?: string) {
  if (!resolvedOrderCollectionIdCache) {
    resolvedOrderCollectionIdCache = (async () => {
      if (preferredId) {
        try {
          await databases.getCollection({
            databaseId,
            collectionId: preferredId,
          })

          return preferredId
        } catch {
          // Fall through to name-based discovery.
        }
      }

      const collectionList = await databases.listCollections({ databaseId })
      const resolvedCollection = collectionList.collections.find((collection) => {
        const normalizedName = collection.name.trim().toLowerCase().replace(/\s+/g, '_')

        return normalizedName === 'order_received' || normalizedName === 'orders' || normalizedName.includes('order')
      })

      if (!resolvedCollection) {
        throw new Error('Unable to find the Appwrite orders collection. Set NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID to the correct collection ID.')
      }

      return resolvedCollection.$id
    })()
  }

  return resolvedOrderCollectionIdCache
}

async function getOrderCollectionContext() {
  const config = getCommerceConfig()
  const databases = createServerDatabasesClient()
  const orderCollectionId = await resolveOrderCollectionId(databases, config.databaseId, config.orderCollectionId)

  return {
    databaseId: config.databaseId,
    orderCollectionId,
    databases,
  }
}

function getRecordValue(record: GenericRecord, keys: string[]) {
  for (const key of keys) {
    if (key in record && record[key] !== undefined && record[key] !== null) {
      return record[key]
    }
  }

  return undefined
}

function getStringValue(record: GenericRecord, keys: string[]) {
  const value = getRecordValue(record, keys)

  return typeof value === 'string' ? value : undefined
}

function getNumberValue(record: GenericRecord, keys: string[]) {
  const value = getRecordValue(record, keys)

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'bigint') {
    return Number(value)
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return undefined
}

function getBooleanValue(record: GenericRecord, keys: string[]) {
  const value = getRecordValue(record, keys)

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'string') {
    if (value === 'true') {
      return true
    }

    if (value === 'false') {
      return false
    }
  }

  return undefined
}

function parseJsonLike<T>(value: unknown): T | null {
  if (!value) {
    return null
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T
    } catch {
      return null
    }
  }

  if (typeof value === 'object') {
    return value as T
  }

  return null
}

function createEmptyDeliveryAddress(): DeliveryAddress {
  return {
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  }
}

function normalizeDeliveryAddress(rawValue: unknown): DeliveryAddress | undefined {
  const parsedValue = parseJsonLike<unknown>(rawValue)

  if (!parsedValue || typeof parsedValue !== 'object') {
    return undefined
  }

  const record = parsedValue as GenericRecord
  const fallback = createEmptyDeliveryAddress()

  const normalizedAddress: DeliveryAddress = {
    fullName: getStringValue(record, ['fullName', 'name']) ?? fallback.fullName,
    phoneNumber: getStringValue(record, ['phoneNumber', 'phone', 'contact']) ?? fallback.phoneNumber,
    addressLine1: getStringValue(record, ['addressLine1']) ?? fallback.addressLine1,
    addressLine2: getStringValue(record, ['addressLine2']) ?? '',
    city: getStringValue(record, ['city']) ?? fallback.city,
    state: getStringValue(record, ['state']) ?? fallback.state,
    postalCode: getStringValue(record, ['postalCode', 'zip', 'pincode']) ?? fallback.postalCode,
    country: getStringValue(record, ['country']) ?? fallback.country,
  }

  const hasAnyValue = Object.values(normalizedAddress).some((value) => `${value ?? ''}`.trim().length > 0)
  return hasAnyValue ? normalizedAddress : undefined
}

function normalizeOrderItem(rawValue: unknown): OrderItem | null {
  const parsedValue = parseJsonLike<unknown>(rawValue)

  if (!parsedValue || typeof parsedValue !== 'object') {
    return null
  }

  const record = parsedValue as GenericRecord
  const id = getStringValue(record, ['id', 'productId', 'product_id', 'slug']) ?? ''
  const productId = getStringValue(record, ['productId', 'product_id', 'id']) ?? id
  const slug = getStringValue(record, ['slug', 'product_slug']) ?? productId ?? id
  const name = getStringValue(record, ['name']) ?? 'Product'
  const price = getNumberValue(record, ['price']) ?? 0
  const quantity = Math.max(1, Math.floor(getNumberValue(record, ['quantity']) ?? 1))
  const total = roundCurrency(getNumberValue(record, ['total']) ?? price * quantity)

  if (!id && !productId && !slug) {
    return null
  }

  return {
    id: id || productId || slug,
    productId: productId || id || slug,
    slug: slug || productId || id,
    name,
    price,
    quantity,
    image: getStringValue(record, ['image']) ?? undefined,
    unit: getStringValue(record, ['unit']) ?? undefined,
    variant: getStringValue(record, ['variant']) ?? undefined,
    total,
  }
}

function normalizeOrderItems(rawValue: unknown): OrderItem[] {
  const parsedValue = parseJsonLike<unknown>(rawValue)

  if (Array.isArray(parsedValue)) {
    return parsedValue
      .map((item) => normalizeOrderItem(item))
      .filter((item): item is OrderItem => Boolean(item))
  }

  if (parsedValue && typeof parsedValue === 'object') {
    const record = parsedValue as GenericRecord

    if (Array.isArray(record.items)) {
      return record.items
        .map((item) => normalizeOrderItem(item))
        .filter((item): item is OrderItem => Boolean(item))
    }
  }

  return []
}

function normalizeStoredOrderSnapshot(rawValue: unknown): StoredOrderSnapshot | null {
  const parsedValue = parseJsonLike<unknown>(rawValue)

  if (!parsedValue) {
    return null
  }

  if (Array.isArray(parsedValue)) {
    const items = parsedValue
      .map((item) => normalizeOrderItem(item))
      .filter((item): item is OrderItem => Boolean(item))

    return {
      items,
      subtotal: getCartSubtotal(
        items.map((item) => ({
          id: item.id,
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? '',
          inStock: true,
          unit: item.unit,
          variant: item.variant,
        }))
      ),
      promoDiscount: 0,
      handlingCharge: 0,
      handlingChargePercent: 5,
      total: roundCurrency(items.reduce((sum, item) => sum + item.total, 0)),
    }
  }

  if (typeof parsedValue !== 'object') {
    return null
  }

  const record = parsedValue as GenericRecord

  return {
    items: normalizeOrderItems(record.items ?? parsedValue),
    subtotal: getNumberValue(record, ['subtotal']) ?? 0,
    promoDiscount: getNumberValue(record, ['promoDiscount', 'discount_amount']) ?? 0,
    handlingCharge: getNumberValue(record, ['handlingCharge', 'handling_charges']) ?? 0,
    handlingChargePercent: getNumberValue(record, ['handlingChargePercent', 'handling_charge_percent']) ?? 5,
    total: getNumberValue(record, ['total', 'total_amount']) ?? 0,
    promoCode: getStringValue(record, ['promoCode', 'discount_code']) ?? undefined,
    customer: parseJsonLike<OrderCustomer>(record.customer) ?? undefined,
    paymentMethod: getStringValue(record, ['payment_method', 'paymentMethod']) ?? undefined,
    paymentStatus: normalizePaymentStatus(getStringValue(record, ['payment_status', 'paymentStatus'])),
    paymentDate: getStringValue(record, ['payment_date', 'paymentDate']) ?? undefined,
    razorpayOrderId: getStringValue(record, ['razorpay_order_id', 'razorpayOrderId']) ?? undefined,
    razorpayPaymentId: getStringValue(record, ['razorpay_payment_id', 'razorpayPaymentId']) ?? undefined,
    razorpaySignature: getStringValue(record, ['razorpay_signature', 'razorpaySignature']) ?? undefined,
  }
}

function normalizePromoDocument(document: Models.Document): PromoCode {
  const record = document as GenericRecord

  return {
    $id: document.$id,
    code: getStringValue(record, ['code']) ?? '',
    discountPercent: getNumberValue(record, ['discount_percent', 'discountPercent']) ?? 0,
    discountAmount: getNumberValue(record, ['discount_amount', 'discountAmount']) ?? 0,
    expiryDate: getStringValue(record, ['expiry_date', 'expiryDate', 'expires_at', 'expiresAt']) ?? null,
    minimumPurchase: getNumberValue(record, ['minimum_purchase', 'minimumPurchase']) ?? null,
    maxUses: getNumberValue(record, ['max_uses', 'maxUses']) ?? null,
    currentUses: getNumberValue(record, ['current_uses', 'currentUses']) ?? null,
    usedByUser: getBooleanValue(record, ['used_by_user', 'usedByUser']) ?? false,
    isActive: getBooleanValue(record, ['active', 'is_active', 'isActive']) ?? true,
    message: getStringValue(record, ['message']),
  }
}

function buildPromoResponse(
  promo: PromoCode,
  subtotal: number,
  fallbackCode: string
): PromoValidationResult {
  const discountAmount = promo.discountAmount > 0
    ? promo.discountAmount
    : roundCurrency(subtotal * (promo.discountPercent / 100))

  return {
    valid: true,
    code: promo.code || fallbackCode,
    discountPercent: promo.discountPercent,
    discountAmount,
    minimumPurchase: promo.minimumPurchase ?? null,
    message: promo.message ?? 'Promo code applied successfully',
  }
}

function normalizeCheckoutReference(reference?: string | null) {
  if (reference) {
    return reference
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .slice(0, 36)
  }

  return ''
}

function normalizePaymentStatus(status?: string | null): PaymentStatus {
  if (status === 'failed' || status === 'pending' || status === 'refunded' || status === 'completed') {
    return status
  }

  if (status === 'confirmed' || status === 'processing' || status === 'in_transit' || status === 'out_for_delivery' || status === 'delivered') {
    return 'completed'
  }

  if (status === 'cancelled') {
    return 'failed'
  }

  return 'pending'
}

function normalizeOrderStatus(status?: string | null, paymentStatus?: PaymentStatus): OrderStatus {
  if (
    status === 'pending' ||
    status === 'confirmed' ||
    status === 'processing' ||
    status === 'in_transit' ||
    status === 'out_for_delivery' ||
    status === 'delivered' ||
    status === 'cancelled'
  ) {
    return status
  }

  if (status === 'completed') {
    return 'confirmed'
  }

  if (status === 'failed') {
    return 'cancelled'
  }

  if (paymentStatus === 'failed') {
    return 'cancelled'
  }

  return 'pending'
}

function normalizeRefundStatus(status?: string | null): RefundStatus {
  if (status === 'pending' || status === 'completed') {
    return status
  }

  return 'none'
}

function buildOrderRecordFromDocument(document: OrderDocument): OrderRecord {
  const record = document as GenericRecord
  const snapshot = normalizeStoredOrderSnapshot(getRecordValue(record, ['items', 'order_payload', 'order']))
  const customerFromRecord = parseJsonLike<OrderCustomer>(getRecordValue(record, ['customer'])) ?? undefined
  const shippingAddress = normalizeDeliveryAddress(getRecordValue(record, ['delivery_address', 'shipping_address']))
  const snapshotCustomerAddress = snapshot?.customer?.deliveryAddress
  const customer = customerFromRecord ?? snapshot?.customer
  const deliveryAddress = shippingAddress ?? snapshotCustomerAddress ?? customer?.deliveryAddress ?? createEmptyDeliveryAddress()
  const normalizedItems = normalizeOrderItems(getRecordValue(record, ['items', 'order_payload', 'order']))
  const items = normalizedItems.length > 0 ? normalizedItems : (snapshot?.items ?? [])
  const date = getStringValue(record, ['date', 'created_at']) ?? document.$createdAt
  const paymentStatus = normalizePaymentStatus(getStringValue(record, ['payment_status', 'status']))
  const orderStatus = normalizeOrderStatus(getStringValue(record, ['status']), paymentStatus)
  const subtotal = getNumberValue(record, ['subtotal']) ?? snapshot?.subtotal ?? getCartSubtotal(
    items.map((item) => ({
      id: item.id,
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? '',
      inStock: true,
      unit: item.unit,
      variant: item.variant,
    }))
  )
  const discountAmount = getNumberValue(record, ['discount_amount']) ?? snapshot?.promoDiscount ?? 0
  const handlingCharges = getNumberValue(record, ['handling_charges']) ?? snapshot?.handlingCharge ?? 0
  const totalAmount = getNumberValue(record, ['total_amount'])
    ?? (
      typeof record.total === 'number' || typeof record.total === 'string' || typeof record.total === 'bigint'
        ? roundCurrency((getNumberValue(record, ['total']) ?? 0) / 100)
        : undefined
    )
    ?? snapshot?.total
    ?? roundCurrency(subtotal - discountAmount + handlingCharges)
  const generatedOrderNumber = generateOrderNumber({
    sequence: getNumberValue(record, ['$sequence']),
    date,
    fallbackId: document.$id,
  })

  return {
    $id: document.$id,
    $sequence: getNumberValue(record, ['$sequence']),
    $createdAt: document.$createdAt,
    $updatedAt: document.$updatedAt,
    orderId: document.$id,

    email: getStringValue(record, ['email']) ?? customer?.email ?? '',
    name: getStringValue(record, ['name']) ?? customer?.name ?? deliveryAddress.fullName,
    phone: getStringValue(record, ['phone']) ?? customer?.contact ?? deliveryAddress.phoneNumber,

    order_number: getStringValue(record, ['order_number']) ?? generatedOrderNumber,
    date,
    items,

    subtotal,
    discount_code: getStringValue(record, ['discount_code']) ?? snapshot?.promoCode ?? undefined,
    discount_amount: discountAmount,
    discount_percent: getNumberValue(record, ['discount_percent']) ?? 0,
    handling_charges: handlingCharges,
    handling_charge_percent: getNumberValue(record, ['handling_charge_percent']) ?? snapshot?.handlingChargePercent ?? 5,
    total_amount: totalAmount,

    delivery_address: deliveryAddress,

    payment_method: getStringValue(record, ['payment_method']) ?? 'razorpay',
    razorpay_order_id: getStringValue(record, ['razorpay_order_id']) ?? snapshot?.razorpayOrderId ?? '',
    razorpay_payment_id: getStringValue(record, ['razorpay_payment_id']) ?? snapshot?.razorpayPaymentId ?? undefined,
    razorpay_signature: getStringValue(record, ['razorpay_signature']) ?? snapshot?.razorpaySignature ?? undefined,
    payment_status: getStringValue(record, ['payment_status']) ? paymentStatus : (snapshot?.paymentStatus ?? paymentStatus),
    payment_date: getStringValue(record, ['payment_date']) ?? snapshot?.paymentDate ?? date,

    type: getStringValue(record, ['type']) ?? undefined,
    status: orderStatus,
    in_transit: getStringValue(record, ['in_transit']) ?? undefined,
    out_for_delivery: getStringValue(record, ['out_for_delivery']) ?? undefined,
    delivered_date: getStringValue(record, ['delivered_date']) ?? undefined,
    tracking_number: getStringValue(record, ['tracking_number']) ?? undefined,

    notes: getStringValue(record, ['notes']) ?? undefined,
    admin_notes: getStringValue(record, ['admin_notes']) ?? undefined,
    refund_status: normalizeRefundStatus(getStringValue(record, ['refund_status'])),
    refund_amount: getNumberValue(record, ['refund_amount']) ?? 0,

    customer: {
      userId: getStringValue(record, ['user_id']) ?? customer?.userId ?? undefined,
      name: getStringValue(record, ['name']) ?? customer?.name ?? undefined,
      email: getStringValue(record, ['email']) ?? customer?.email ?? undefined,
      contact: getStringValue(record, ['phone']) ?? customer?.contact ?? undefined,
      deliveryAddress,
    },
  }
}

async function getOrderCollectionAttributes() {
  if (!orderCollectionAttributeCache) {
    orderCollectionAttributeCache = (async () => {
      const { databaseId, orderCollectionId, databases } = await getOrderCollectionContext()

      try {
        const attributeList = await databases.listAttributes({
          databaseId,
          collectionId: orderCollectionId,
        })

        return new Set(attributeList.attributes.map((attribute) => attribute.key))
      } catch {
        return new Set([
          'id',
          'user_id',
          'items',
          'total',
          'status',
          'razorpay_order_id',
          'razorpay_payment_id',
          'shipping_address',
          'created_at',
        ])
      }
    })()
  }

  return orderCollectionAttributeCache
}

function setDocumentValue(
  data: GenericRecord,
  attributes: Set<string>,
  key: string,
  value: unknown
) {
  if (!attributes.has(key) || value === undefined) {
    return
  }

  data[key] = value
}

function supportsExpandedOrderSchema(attributes: Set<string>) {
  return attributes.has('payment_status') || attributes.has('order_number') || attributes.has('subtotal')
}

function buildOrderDocumentData(input: {
  documentId: string
  createdAt: string
  orderNumber?: string
  items: CartItem[]
  pricing: CheckoutPricing
  customer?: OrderCustomer
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature?: string
  paymentMethod: string
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  type?: string
  notes?: string
  attributes: Set<string>
}) {
  const orderItems = input.items.map((item) => buildOrderItemFromCartItem(item))
  const deliveryAddress = input.customer?.deliveryAddress
  const discountPercent = input.pricing.promo?.discountPercent ?? 0
  const snapshot: StoredOrderSnapshot = {
    items: orderItems,
    subtotal: input.pricing.subtotal,
    promoDiscount: input.pricing.promoDiscount,
    handlingCharge: input.pricing.handlingCharge,
    handlingChargePercent: input.pricing.handlingChargePercent,
    total: input.pricing.total,
    promoCode: input.pricing.promo?.code ?? null,
    customer: input.customer,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentStatus,
    paymentDate: input.createdAt,
    razorpayOrderId: input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
  }
  const data: GenericRecord = {}
  const expandedSchema = supportsExpandedOrderSchema(input.attributes)

  setDocumentValue(data, input.attributes, 'id', input.documentId)
  setDocumentValue(data, input.attributes, 'user_id', input.customer?.userId ?? 'guest')
  setDocumentValue(data, input.attributes, 'items', expandedSchema ? orderItems : snapshot)
  setDocumentValue(data, input.attributes, 'order', JSON.stringify(snapshot))
  setDocumentValue(data, input.attributes, 'order_payload', JSON.stringify(snapshot))
  setDocumentValue(data, input.attributes, 'total', Math.round(input.pricing.total * 100))
  setDocumentValue(
    data,
    input.attributes,
    'status',
    input.attributes.has('payment_status')
      ? input.orderStatus
      : input.paymentStatus === 'completed'
        ? 'completed'
        : input.paymentStatus
  )
  setDocumentValue(data, input.attributes, 'razorpay_order_id', input.razorpayOrderId)
  setDocumentValue(data, input.attributes, 'razorpay_payment_id', input.razorpayPaymentId)
  setDocumentValue(data, input.attributes, 'shipping_address', deliveryAddress ?? input.customer ?? {})
  setDocumentValue(data, input.attributes, 'created_at', input.createdAt)

  setDocumentValue(data, input.attributes, 'email', input.customer?.email ?? '')
  setDocumentValue(data, input.attributes, 'name', input.customer?.name ?? deliveryAddress?.fullName ?? '')
  setDocumentValue(data, input.attributes, 'phone', input.customer?.contact ?? deliveryAddress?.phoneNumber ?? '')
  setDocumentValue(data, input.attributes, 'order_number', input.orderNumber)
  setDocumentValue(data, input.attributes, 'date', input.createdAt)
  setDocumentValue(data, input.attributes, 'subtotal', input.pricing.subtotal)
  setDocumentValue(data, input.attributes, 'discount_code', input.pricing.promo?.code ?? '')
  setDocumentValue(data, input.attributes, 'discount_amount', input.pricing.promoDiscount)
  setDocumentValue(data, input.attributes, 'discount_percent', discountPercent)
  setDocumentValue(data, input.attributes, 'handling_charges', input.pricing.handlingCharge)
  setDocumentValue(data, input.attributes, 'handling_charge_percent', input.pricing.handlingChargePercent)
  setDocumentValue(data, input.attributes, 'total_amount', input.pricing.total)
  setDocumentValue(data, input.attributes, 'delivery_address', deliveryAddress ?? createEmptyDeliveryAddress())
  setDocumentValue(data, input.attributes, 'payment_method', input.paymentMethod)
  setDocumentValue(data, input.attributes, 'razorpay_signature', input.razorpaySignature ?? '')
  setDocumentValue(data, input.attributes, 'payment_status', input.paymentStatus)
  setDocumentValue(data, input.attributes, 'payment_date', input.createdAt)
  setDocumentValue(data, input.attributes, 'type', input.type ?? '')
  setDocumentValue(data, input.attributes, 'notes', input.notes ?? '')
  setDocumentValue(data, input.attributes, 'refund_status', 'none')
  setDocumentValue(data, input.attributes, 'refund_amount', 0)

  return data
}

function buildOrderUpdateData(attributes: Set<string>, input: UpdateOrderInput) {
  const updateData: GenericRecord = {}
  const now = new Date().toISOString()

  if (input.status) {
    setDocumentValue(updateData, attributes, 'status', input.status)

    if (input.status === 'in_transit' && !input.in_transit) {
      setDocumentValue(updateData, attributes, 'in_transit', now)
    }

    if (input.status === 'out_for_delivery' && !input.out_for_delivery) {
      setDocumentValue(updateData, attributes, 'out_for_delivery', now)
    }

    if (input.status === 'delivered' && !input.delivered_date) {
      setDocumentValue(updateData, attributes, 'delivered_date', now)
    }
  }

  setDocumentValue(updateData, attributes, 'tracking_number', input.tracking_number)
  setDocumentValue(updateData, attributes, 'in_transit', input.in_transit)
  setDocumentValue(updateData, attributes, 'out_for_delivery', input.out_for_delivery)
  setDocumentValue(updateData, attributes, 'delivered_date', input.delivered_date)
  setDocumentValue(updateData, attributes, 'admin_notes', input.admin_notes)
  setDocumentValue(updateData, attributes, 'notes', input.notes)
  setDocumentValue(updateData, attributes, 'refund_status', input.refund_status)
  setDocumentValue(updateData, attributes, 'refund_amount', input.refund_amount)
  setDocumentValue(updateData, attributes, 'payment_status', input.payment_status)
  setDocumentValue(updateData, attributes, 'type', input.type)

  return updateData
}

function getOrderSortField(attributes: Set<string>) {
  if (attributes.has('date')) {
    return 'date'
  }

  if (attributes.has('created_at')) {
    return 'created_at'
  }

  return '$createdAt'
}

function orderBelongsToViewer(order: OrderRecord, viewer: { userId?: string; email?: string }) {
  if (viewer.userId && order.customer?.userId === viewer.userId) {
    return true
  }

  if (viewer.email && order.email && order.email.toLowerCase() === viewer.email.toLowerCase()) {
    return true
  }

  return false
}

export function generateCheckoutReference() {
  return `ord_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`.slice(0, 36)
}

export async function resolveCheckoutCustomer(
  sessionSecret: string | undefined,
  providedCustomer?: OrderCustomer | null
): Promise<OrderCustomer | undefined> {
  if (!sessionSecret) {
    return providedCustomer ?? undefined
  }

  const authPayload = await getAuthSessionPayload(sessionSecret)

  return buildOrderCustomer({
    user: authPayload.user,
    profile: authPayload.profile,
    fallback: providedCustomer,
  })
}

export async function validatePromoCodeOnServer(code: string, subtotal: number): Promise<PromoValidationResult> {
  const normalizedCode = code.trim().toUpperCase()

  if (!normalizedCode) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'Enter a promo code to continue',
    }
  }

  const { databaseId, promoCollectionId } = getCommerceConfig({ requirePromo: true })
  const databases = createServerDatabasesClient()

  const promoResults = await databases.listDocuments({
    databaseId,
    collectionId: promoCollectionId!,
    queries: [
      Query.equal('code', [normalizedCode, normalizedCode.toLowerCase()]),
      Query.limit(1),
    ],
  })

  const promoDocument = promoResults.documents[0]

  if (!promoDocument) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'Promo code not found',
    }
  }

  const promo = normalizePromoDocument(promoDocument)

  if (promo.isActive === false) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'Promo code is not active',
    }
  }

  if (promo.expiryDate && new Date(promo.expiryDate).getTime() < Date.now()) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'Promo code has expired',
    }
  }

  if (promo.minimumPurchase && subtotal < promo.minimumPurchase) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      minimumPurchase: promo.minimumPurchase,
      message: `Minimum purchase amount not met (Minimum: ${formatCurrencyAmount(promo.minimumPurchase, 0)})`,
    }
  }

  if (promo.maxUses !== null && promo.maxUses !== undefined) {
    const currentUses = promo.currentUses ?? 0

    if (currentUses >= promo.maxUses) {
      return {
        valid: false,
        discountPercent: 0,
        discountAmount: 0,
        message: 'Promo code usage limit exceeded',
      }
    }
  }

  if (promo.usedByUser) {
    return {
      valid: false,
      discountPercent: 0,
      discountAmount: 0,
      message: 'You have already used this code',
    }
  }

  return buildPromoResponse(promo, subtotal, normalizedCode)
}

export async function buildCheckoutPricing(input: {
  items: CartItem[]
  handlingChargePercent: number
  promoCode?: string | null
}): Promise<CheckoutPricing> {
  const normalizedHandlingPercent = FIXED_HANDLING_CHARGE_PERCENT
  const subtotal = getCartSubtotal(input.items)
  let appliedPromo: AppliedPromo | null = null

  if (input.promoCode) {
    const promoResult = await validatePromoCodeOnServer(input.promoCode, subtotal)

    if (!promoResult.valid) {
      throw new Error(promoResult.message)
    }

    appliedPromo = {
      code: promoResult.code ?? input.promoCode.trim().toUpperCase(),
      discountPercent: promoResult.discountPercent,
      discountAmount: promoResult.discountAmount,
      minimumPurchase: promoResult.minimumPurchase,
      message: promoResult.message,
    }
  }

  const totals = calculateCartTotals(input.items, appliedPromo, normalizedHandlingPercent)

  return {
    ...totals,
    handlingChargePercent: normalizedHandlingPercent,
    promo: appliedPromo,
  }
}

export async function createRazorpayOrder(input: {
  checkoutReference?: string | null
  amount: number
  itemCount: number
}) {
  const config = getCommerceConfig({ requireRazorpay: true })
  const checkoutReference = normalizeCheckoutReference(input.checkoutReference) || generateCheckoutReference()
  const amountInPaise = Math.round(roundCurrency(input.amount) * 100)
  const basicAuthToken = Buffer.from(`${config.razorpayKeyId}:${config.razorpaySecret}`).toString('base64')

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuthToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: checkoutReference,
      notes: {
        itemCount: String(input.itemCount),
      },
    }),
  })

  const payload = await response.json().catch(() => null) as
    | {
        id?: string
        amount?: number
        currency?: string
        receipt?: string
        error?: { description?: string }
      }
    | null

  if (!response.ok || !payload?.id || !payload.amount) {
    throw new Error(payload?.error?.description ?? 'Unable to create Razorpay order')
  }

  return {
    checkoutReference,
    keyId: config.razorpayKeyId,
    razorpayOrderId: payload.id,
    amount: payload.amount,
    currency: payload.currency ?? 'INR',
    storeName: config.storeName,
  }
}

export function verifyRazorpaySignature(input: {
  razorpayOrderId: string
  razorpayPaymentId: string
  signature: string
}) {
  const config = getCommerceConfig({ requireRazorpay: true })

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpaySecret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest('hex')

  return expectedSignature === input.signature
}

export async function createOrderRecordInAppwrite(input: CreateOrderRecordInput) {
  const { databaseId, orderCollectionId, databases } = await getOrderCollectionContext()
  const attributes = await getOrderCollectionAttributes()
  const createdAt = new Date().toISOString()
  const documentId = normalizeCheckoutReference(input.checkoutReference) || generateCheckoutReference()
  const provisionalOrderNumber = attributes.has('order_number')
    ? generateOrderNumber({
        date: createdAt,
        fallbackId: documentId,
      })
    : undefined

  const createdOrder = await databases.createDocument<OrderDocument>({
    databaseId,
    collectionId: orderCollectionId,
    documentId,
    data: buildOrderDocumentData({
      documentId,
      createdAt,
      orderNumber: provisionalOrderNumber,
      items: input.items,
      pricing: input.pricing,
      customer: input.customer,
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      paymentMethod: input.paymentMethod ?? 'razorpay',
      paymentStatus: input.paymentStatus ?? 'completed',
      orderStatus: input.orderStatus ?? 'pending',
      type: input.type,
      notes: input.notes,
      attributes,
    }),
  })

  const finalOrderNumber = generateOrderNumber({
    sequence: getNumberValue(createdOrder as GenericRecord, ['$sequence']),
    date: createdAt,
    fallbackId: documentId,
  })

  if (attributes.has('order_number') && finalOrderNumber !== provisionalOrderNumber) {
    const updatedOrder = await databases.updateDocument<OrderDocument>({
      databaseId,
      collectionId: orderCollectionId,
      documentId,
      data: {
        order_number: finalOrderNumber,
      },
    })

    return buildOrderRecordFromDocument(updatedOrder)
  }

  return buildOrderRecordFromDocument(createdOrder)
}

export async function updateOrderRecordInAppwrite(orderId: string, input: UpdateOrderInput) {
  const normalizedOrderId = normalizeCheckoutReference(orderId)

  if (!normalizedOrderId) {
    throw new Error('Invalid order ID')
  }

  const { databaseId, orderCollectionId, databases } = await getOrderCollectionContext()
  const attributes = await getOrderCollectionAttributes()
  const updateData = buildOrderUpdateData(attributes, input)

  if (Object.keys(updateData).length === 0) {
    const existingOrder = await databases.getDocument<OrderDocument>({
      databaseId,
      collectionId: orderCollectionId,
      documentId: normalizedOrderId,
    })

    return buildOrderRecordFromDocument(existingOrder)
  }

  const updatedOrder = await databases.updateDocument<OrderDocument>({
    databaseId,
    collectionId: orderCollectionId,
    documentId: normalizedOrderId,
    data: updateData,
  })

  return buildOrderRecordFromDocument(updatedOrder)
}

export async function getOrderById(orderId: string) {
  const normalizedOrderId = normalizeCheckoutReference(orderId)

  if (!normalizedOrderId) {
    return null
  }

  try {
    const { databaseId, orderCollectionId, databases } = await getOrderCollectionContext()
    const orderDocument = await databases.getDocument<OrderDocument>({
      databaseId,
      collectionId: orderCollectionId,
      documentId: normalizedOrderId,
    })

    return buildOrderRecordFromDocument(orderDocument)
  } catch {
    return null
  }
}

export async function getOrdersForCustomer(viewer: {
  userId?: string
  email?: string
  limit?: number
}) {
  if (!viewer.userId && !viewer.email) {
    return []
  }

  try {
    const { databaseId, orderCollectionId, databases } = await getOrderCollectionContext()
    const attributes = await getOrderCollectionAttributes()
    const queries = [
      Query.limit(viewer.limit ?? 100),
      Query.orderDesc(getOrderSortField(attributes)),
    ]

    if (viewer.email && attributes.has('email')) {
      queries.push(Query.equal('email', viewer.email))
    } else if (viewer.userId && attributes.has('user_id')) {
      queries.push(Query.equal('user_id', viewer.userId))
    } else {
      return []
    }

    const results = await databases.listDocuments<OrderDocument>({
      databaseId,
      collectionId: orderCollectionId,
      queries,
    })

    return results.documents.map((document) => buildOrderRecordFromDocument(document))
  } catch {
    return []
  }
}

export async function getOrderByIdForCustomer(
  orderId: string,
  viewer: {
    userId?: string
    email?: string
  }
) {
  const order = await getOrderById(orderId)

  if (!order || !orderBelongsToViewer(order, viewer)) {
    return null
  }

  return order
}
