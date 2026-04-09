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
  type?: string
  notes?: string
}) {
  const response = await fetch('/api/orders/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => null) as
    | {
        orderId: string
        orderNumber?: string
        status: string
        paymentStatus?: string
        emailSent?: boolean
        emailMessageId?: string
        order: OrderRecord
        message?: string
      }
    | null

  if (!response.ok || !payload?.orderId) {
    throw new Error(payload?.message ?? 'Unable to create order')
  }

  return payload
}

export async function fetchUserOrders() {
  const response = await fetch('/api/orders/user', {
    credentials: 'include',
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null) as OrderRecord[] | { message?: string } | null

  if (!response.ok) {
    throw new Error((payload && 'message' in payload ? payload.message : undefined) ?? 'Unable to load orders')
  }

  return payload as OrderRecord[]
}

export async function fetchOrderById(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}`, {
    credentials: 'include',
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null) as OrderRecord | { message?: string } | null

  if (!response.ok) {
    throw new Error((payload && 'message' in payload ? payload.message : undefined) ?? 'Unable to load order')
  }

  return payload as OrderRecord
}

export async function resendOrderConfirmationEmail(orderId: string) {
  const response = await fetch('/api/emails/send-order-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ orderId }),
  })

  const payload = await response.json().catch(() => null) as
    | { success: boolean; messageId?: string; message?: string; order?: OrderRecord }
    | null

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? 'Unable to resend the order confirmation email')
  }

  return payload
}

export async function downloadOrderReceipt(orderId: string) {
  const response = await fetch(`/api/orders/${orderId}/download-receipt`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message ?? 'Unable to download receipt')
  }

  const blob = await response.blob()
  const contentDisposition = response.headers.get('Content-Disposition') ?? ''
  const fileNameMatch = contentDisposition.match(/filename="(.+)"/)
  const fileName = fileNameMatch?.[1] ?? `Order-${orderId}.html`
  const objectUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(objectUrl)
}
