import type { CartItem } from '@/types/cart'
import type { CheckoutPricing, OrderCustomer, OrderRecord } from '@/types/order'

export async function createOrderRecord(input: {
  checkoutReference: string
  items: CartItem[]
  pricing: CheckoutPricing
  customer?: OrderCustomer
  razorpayOrderId: string
  razorpayPaymentId: string
  signature: string
}) {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => null) as
    | { orderId: string; status: string; order: OrderRecord; message?: string }
    | null

  if (!response.ok || !payload?.orderId) {
    throw new Error(payload?.message ?? 'Unable to create order')
  }

  return payload
}
