import type { CartItem } from '@/types/cart'
import type { AppliedPromo } from '@/types/promo'

export interface OrderCustomer {
  userId?: string
  name?: string
  email?: string
  contact?: string
}

export interface OrderRecord {
  orderId: string
  items: CartItem[]
  subtotal: number
  promoDiscount: number
  promoCode?: string
  handlingCharge: number
  handlingChargePercent: number
  total: number
  paymentMethod: 'razorpay'
  paymentStatus: 'pending' | 'completed' | 'failed'
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  createdAt: string
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
