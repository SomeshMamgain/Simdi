import type { CartItem } from '@/types/cart'
import type { AddressFormData } from '@/types/address'
import type { AppliedPromo } from '@/types/promo'

export type PaymentMethod = 'razorpay' | 'cod' | string
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
export type RefundStatus = 'none' | 'pending' | 'completed'

export interface DeliveryAddress extends AddressFormData {}

export interface OrderItem {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image?: string
  unit?: string
  variant?: string
  total: number
}

export interface OrderCustomer {
  userId?: string
  name?: string
  email?: string
  contact?: string
  deliveryAddress?: DeliveryAddress
}

export interface OrderStatusDisplay {
  label: string
  color: string
  bgColor: string
  badge: string
  icon: string
}

export interface OrderRecord {
  $id: string
  $sequence?: number
  $createdAt: string
  $updatedAt: string
  orderId: string

  email: string
  name: string
  phone: string

  order_number: string
  date: string
  items: OrderItem[]

  subtotal: number
  discount_code?: string
  discount_amount: number
  discount_percent: number
  handling_charges: number
  handling_charge_percent: number
  total_amount: number

  delivery_address: DeliveryAddress

  payment_method: PaymentMethod
  razorpay_order_id: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  payment_status: PaymentStatus
  payment_date: string

  type?: string
  status: OrderStatus
  in_transit?: string
  out_for_delivery?: string
  delivered_date?: string
  tracking_number?: string

  notes?: string
  admin_notes?: string
  refund_status: RefundStatus
  refund_amount: number

  customer?: OrderCustomer
}

export interface CheckoutPricing {
  subtotal: number
  promoDiscount: number
  handlingCharge: number
  handlingChargePercent: number
  total: number
  promo?: AppliedPromo | null
}

export function buildOrderItemFromCartItem(item: CartItem): OrderItem {
  return {
    id: item.id,
    productId: item.productId,
    slug: item.slug,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    unit: item.unit,
    variant: item.variant,
    total: Math.round(item.price * item.quantity * 100) / 100,
  }
}
