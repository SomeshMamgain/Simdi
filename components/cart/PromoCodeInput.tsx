'use client'

import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { validatePromoCode } from '@/lib/services/promo-code-service'
import { useCartStore } from '@/store/cartStore'

import styles from './cart.module.css'

interface PromoCodeInputProps {
  subtotal: number
}

interface PromoStatus {
  tone: 'success' | 'error'
  message: string
}

function isPromoCodeFormatValid(value: string) {
  return /^[A-Za-z0-9_-]{3,24}$/.test(value.trim())
}

export function PromoCodeInput({ subtotal }: PromoCodeInputProps) {
  const appliedPromo = useCartStore((state) => state.appliedPromo)
  const applyPromoCode = useCartStore((state) => state.applyPromoCode)
  const removePromoCode = useCartStore((state) => state.removePromoCode)
  const [code, setCode] = useState(appliedPromo?.code ?? '')
  const [status, setStatus] = useState<PromoStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setCode(appliedPromo?.code ?? '')
  }, [appliedPromo?.code])

  useEffect(() => {
    if (appliedPromo?.minimumPurchase && subtotal < appliedPromo.minimumPurchase) {
      setStatus({
        tone: 'error',
        message: `Add more to keep ${appliedPromo.code} active.`,
      })
      return
    }

    if (appliedPromo) {
      setStatus({
        tone: 'success',
        message: appliedPromo.message ?? `${appliedPromo.code} is applied.`,
      })
    }
  }, [appliedPromo, subtotal])

  const handleApplyPromo = async () => {
    if (!isPromoCodeFormatValid(code)) {
      setStatus({
        tone: 'error',
        message: 'Enter a valid promo code format',
      })
      return
    }

    setIsLoading(true)

    try {
      const result = await validatePromoCode(code, subtotal)

      if (!result.valid) {
        setStatus({
          tone: 'error',
          message: result.message,
        })
        return
      }

      applyPromoCode({
        code: result.code ?? code.trim().toUpperCase(),
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
        minimumPurchase: result.minimumPurchase,
        message: result.message,
      })

      setStatus({
        tone: 'success',
        message: result.message,
      })
      toast.success(result.message)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to validate promo code'

      setStatus({
        tone: 'error',
        message,
      })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePromo = () => {
    removePromoCode()
    setCode('')
    setStatus(null)
    toast('Promo removed from this order')
  }

  return (
    <div className={styles.promoPanel}>
      <div className={styles.panelHeading}>
        <div>
          <h3 className={styles.panelTitle}>Promo Code</h3>
        </div>
        {appliedPromo ? (
          <button type="button" className={styles.textButton} onClick={handleRemovePromo}>
            Remove Promo
          </button>
        ) : null}
      </div>

      <div className={styles.promoInputRow}>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Enter code"
          className={styles.promoInput}
          aria-label="Promo code"
          disabled={isLoading}
        />
        <button type="button" className={styles.promoButton} onClick={handleApplyPromo} disabled={isLoading || !code.trim()}>
          {isLoading ? 'Applying...' : 'Apply'}
        </button>
      </div>

      {status ? (
        <div className={`${styles.warning} ${status.tone === 'success' ? styles.success : ''}`}>
          {status.message}
        </div>
      ) : null}
    </div>
  )
}
