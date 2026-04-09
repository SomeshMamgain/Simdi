'use client'

import { startTransition, useState } from 'react'

import { Lock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { createOrderRecord } from '@/lib/services/order-service'
import { createPaymentOrder, loadRazorpayScript, verifyPayment } from '@/lib/services/payment-service'
import { useCartStore } from '@/store/cartStore'

import styles from './cart.module.css'

export function CheckoutButton() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const appliedPromo = useCartStore((state) => state.appliedPromo)
  const handlingChargePercent = useCartStore((state) => state.handlingChargePercent)
  const clearCart = useCartStore((state) => state.clearCart)
  const setLastCompletedOrder = useCartStore((state) => state.setLastCompletedOrder)
  const [isPreparing, setIsPreparing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const isDisabled = items.length === 0 || isPreparing || isVerifying

  const handleCheckout = async () => {
    if (!items.length) {
      toast.error('Your cart is empty')
      return
    }

    try {
      setIsPreparing(true)
      await loadRazorpayScript()

      const paymentOrder = await createPaymentOrder({
        items,
        promoCode: appliedPromo?.code ?? null,
        handlingChargePercent,
      })

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable')
      }

      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: paymentOrder.storeName,
        description: `Order for ${items.length} item${items.length === 1 ? '' : 's'}`,
        order_id: paymentOrder.razorpayOrderId,
        prefill: {
          name: paymentOrder.customer?.name,
          email: paymentOrder.customer?.email,
          contact: paymentOrder.customer?.contact,
        },
        notes: {
          checkoutReference: paymentOrder.checkoutReference,
        },
        theme: {
          color: '#11522b',
        },
        modal: {
          ondismiss: () => {
            setIsPreparing(false)
            toast.error('Payment was cancelled. Your cart is still here.')
          },
        },
        handler: async (response) => {
          setIsPreparing(false)
          setIsVerifying(true)

          try {
            await verifyPayment({
              checkoutReference: paymentOrder.checkoutReference,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })

            const orderResponse = await createOrderRecord({
              checkoutReference: paymentOrder.checkoutReference,
              items,
              pricing: paymentOrder.pricing,
              customer: paymentOrder.customer,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            })

            setLastCompletedOrder(orderResponse.order)
            clearCart()
            toast.success('Payment successful. Your order has been placed.')

            startTransition(() => {
              router.push(`/order-confirmation/${orderResponse.orderId}`)
            })
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Payment completed but order confirmation failed'
            toast.error(message)
          } finally {
            setIsVerifying(false)
          }
        },
      })

      razorpay.on('payment.failed', (response) => {
        setIsPreparing(false)
        toast.error(response.error.description ?? 'Payment failed. Please try again.')
      })

      razorpay.open()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start checkout'
      setIsPreparing(false)
      toast.error(message)
    }
  }

  return (
    <button type="button" className={styles.checkoutButton} disabled={isDisabled} onClick={handleCheckout}>
      {isPreparing || isVerifying ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
      {isPreparing ? 'Preparing Checkout...' : isVerifying ? 'Verifying Payment...' : 'Proceed to Checkout'}
    </button>
  )
}
