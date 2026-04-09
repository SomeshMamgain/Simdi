import type { CartItem } from '@/types/cart'
import type { CheckoutPricing, OrderCustomer } from '@/types/order'

let razorpayScriptPromise: Promise<void> | null = null

interface CreatePaymentOrderResponse {
  checkoutReference: string
  keyId: string
  razorpayOrderId: string
  amount: number
  currency: string
  storeName: string
  customer?: OrderCustomer
  pricing: CheckoutPricing
}

export async function loadRazorpayScript() {
  if (typeof window === 'undefined') {
    throw new Error('Razorpay can only be loaded in the browser')
  }

  if (window.Razorpay) {
    return
  }

  if (!razorpayScriptPromise) {
    razorpayScriptPromise = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-sdk="true"]')

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay checkout')), { once: true })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.dataset.razorpaySdk = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Unable to load Razorpay checkout'))
      document.body.appendChild(script)
    })
  }

  await razorpayScriptPromise
}

export async function createPaymentOrder(input: {
  items: CartItem[]
  promoCode?: string | null
  handlingChargePercent: number
  customer?: OrderCustomer
}) {
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => null) as CreatePaymentOrderResponse | { message?: string } | null

  if (!response.ok) {
    const errorMessage = payload && 'message' in payload ? payload.message : undefined

    throw new Error(errorMessage ?? 'Unable to initialize payment')
  }

  return payload as CreatePaymentOrderResponse
}

export async function verifyPayment(input: {
  checkoutReference: string
  razorpayOrderId: string
  razorpayPaymentId: string
  signature: string
}) {
  const response = await fetch('/api/payment/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => null) as
    | { verified: boolean; orderId?: string; message?: string }
    | null

  if (!response.ok || !payload?.verified) {
    throw new Error(payload?.message ?? 'Payment verification failed')
  }

  return payload
}
