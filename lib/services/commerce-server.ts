import 'server-only'

import crypto from 'node:crypto'

import { Client, Databases, Query, type Models } from 'node-appwrite'

import { calculateCartTotals, getCartSubtotal, roundCurrency } from '@/lib/cart-helpers'
import { formatCurrencyAmount } from '@/lib/product-utils'
import { buildOrderCustomer, getAuthSessionPayload } from '@/lib/services/user-profile-server'
import type { CartItem } from '@/types/cart'
import type { CheckoutPricing, OrderCustomer, OrderRecord } from '@/types/order'
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

interface OrderDocument extends Models.Document {
  id?: string
  user_id?: string
  items?: unknown
  total?: number | string
  status?: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  shipping_address?: unknown
  created_at?: string
}

interface StoredOrderSnapshot {
  items: CartItem[]
  subtotal: number
  promoDiscount: number
  handlingCharge: number
  handlingChargePercent: number
  total: number
  promoCode?: string | null
  customer?: OrderCustomer
}

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
  const orderCollectionId = getEnvironmentValue('NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID', 'APPWRITE_ORDER_COLLECTION_ID')
  const razorpayKeyId = getEnvironmentValue('RAZORPAY_KEY_ID', 'NEXT_PUBLIC_RAZORPAY_KEY_ID')
  const razorpaySecret = getEnvironmentValue('RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET')
  const storeName = getEnvironmentValue('NEXT_PUBLIC_STORE_NAME', 'STORE_NAME') || 'Simdi'

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

  if (options?.requireOrders && !orderCollectionId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ORDER_COLLECTION_ID')
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

function getRecordValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (key in record && record[key] !== undefined && record[key] !== null) {
      return record[key]
    }
  }

  return undefined
}

function getStringValue(record: Record<string, unknown>, keys: string[]) {
  const value = getRecordValue(record, keys)

  return typeof value === 'string' ? value : undefined
}

function getNumberValue(record: Record<string, unknown>, keys: string[]) {
  const value = getRecordValue(record, keys)

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return parsedValue
    }
  }

  return undefined
}

function getBooleanValue(record: Record<string, unknown>, keys: string[]) {
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

function normalizePromoDocument(document: Models.Document): PromoCode {
  const record = document as Record<string, unknown>

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

function normalizeStoredOrderSnapshot(rawValue: unknown): StoredOrderSnapshot | null {
  const parsedValue = parseJsonLike<unknown>(rawValue)

  if (!parsedValue) {
    return null
  }

  if (Array.isArray(parsedValue)) {
    return {
      items: parsedValue as CartItem[],
      subtotal: getCartSubtotal(parsedValue as CartItem[]),
      promoDiscount: 0,
      handlingCharge: 0,
      handlingChargePercent: 5,
      total: getCartSubtotal(parsedValue as CartItem[]),
    }
  }

  if (typeof parsedValue !== 'object') {
    return null
  }

  const record = parsedValue as Record<string, unknown>

  return {
    items: Array.isArray(record.items) ? (record.items as CartItem[]) : [],
    subtotal: getNumberValue(record, ['subtotal']) ?? 0,
    promoDiscount: getNumberValue(record, ['promoDiscount']) ?? 0,
    handlingCharge: getNumberValue(record, ['handlingCharge']) ?? 0,
    handlingChargePercent: getNumberValue(record, ['handlingChargePercent']) ?? 5,
    total: getNumberValue(record, ['total']) ?? 0,
    promoCode: getStringValue(record, ['promoCode']) ?? undefined,
    customer: parseJsonLike<OrderCustomer>(record.customer) ?? undefined,
  }
}

function normalizeOrderDocument(document: OrderDocument): OrderRecord {
  const snapshot = normalizeStoredOrderSnapshot(document.items)
  const shippingAddress = parseJsonLike<OrderCustomer>(document.shipping_address)
  const fallbackItems = snapshot?.items ?? []
  const subtotal = snapshot?.subtotal ?? getCartSubtotal(fallbackItems)
  const promoDiscount = snapshot?.promoDiscount ?? 0
  const handlingCharge = snapshot?.handlingCharge ?? 0
  const totalField = typeof document.total === 'number'
    ? roundCurrency(document.total / 100)
    : 0
  const total = snapshot?.total ?? (totalField > 0 ? totalField : subtotal)
  const paymentStatus = document.status === 'failed' || document.status === 'pending'
    ? document.status
    : 'completed'

  return {
    orderId: document.id ?? document.$id,
    items: fallbackItems,
    subtotal,
    promoDiscount,
    promoCode: snapshot?.promoCode ?? undefined,
    handlingCharge,
    handlingChargePercent: snapshot?.handlingChargePercent ?? 5,
    total,
    paymentMethod: 'razorpay',
    paymentStatus,
    razorpayOrderId: document.razorpay_order_id ?? '',
    razorpayPaymentId: document.razorpay_payment_id ?? undefined,
    createdAt: document.created_at ?? document.$createdAt,
    customer: snapshot?.customer ?? shippingAddress ?? undefined,
  }
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
  const normalizedHandlingPercent = input.handlingChargePercent === 10 ? 10 : 5
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

export async function createOrderRecordInAppwrite(input: {
  checkoutReference: string
  items: CartItem[]
  pricing: CheckoutPricing
  customer?: OrderCustomer
  razorpayOrderId: string
  razorpayPaymentId: string
  paymentStatus?: 'pending' | 'completed' | 'failed'
}) {
  const { databaseId, orderCollectionId } = getCommerceConfig({ requireOrders: true })
  const databases = createServerDatabasesClient()
  const createdAt = new Date().toISOString()
  const documentId = normalizeCheckoutReference(input.checkoutReference) || generateCheckoutReference()
  const snapshot: StoredOrderSnapshot = {
    items: input.items,
    subtotal: input.pricing.subtotal,
    promoDiscount: input.pricing.promoDiscount,
    handlingCharge: input.pricing.handlingCharge,
    handlingChargePercent: input.pricing.handlingChargePercent,
    total: input.pricing.total,
    promoCode: input.pricing.promo?.code ?? null,
    customer: input.customer,
  }

  const createdOrder = await databases.createDocument<OrderDocument>({
    databaseId,
    collectionId: orderCollectionId!,
    documentId,
    data: {
      id: documentId,
      user_id: input.customer?.userId ?? 'guest',
      items: snapshot,
      total: Math.round(input.pricing.total * 100),
      status: input.paymentStatus ?? 'completed',
      razorpay_order_id: input.razorpayOrderId,
      razorpay_payment_id: input.razorpayPaymentId,
      shipping_address: input.customer ?? {},
      created_at: createdAt,
    },
  })

  return normalizeOrderDocument(createdOrder)
}

export async function getOrderById(orderId: string) {
  const normalizedOrderId = normalizeCheckoutReference(orderId)

  if (!normalizedOrderId) {
    return null
  }

  try {
    const { databaseId, orderCollectionId } = getCommerceConfig({ requireOrders: true })
    const databases = createServerDatabasesClient()
    const orderDocument = await databases.getDocument<OrderDocument>({
      databaseId,
      collectionId: orderCollectionId!,
      documentId: normalizedOrderId,
    })

    return normalizeOrderDocument(orderDocument)
  } catch {
    return null
  }
}
