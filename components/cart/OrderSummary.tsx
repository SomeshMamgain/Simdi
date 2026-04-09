'use client'

import { FIXED_HANDLING_CHARGE_PERCENT } from '@/lib/cart-helpers'
import { formatCurrencyAmount } from '@/lib/product-utils'
import { useCartStore } from '@/store/cartStore'

import { CheckoutButton } from './CheckoutButton'
import { PromoCodeInput } from './PromoCodeInput'
import styles from './cart.module.css'

export function OrderSummary() {
  const appliedPromo = useCartStore((state) => state.appliedPromo)
  const subtotal = useCartStore((state) => state.getSubtotal())
  const promoDiscount = useCartStore((state) => state.getPromoDiscountAmount())
  const handlingCharge = useCartStore((state) => state.getHandlingChargeAmount())
  const total = useCartStore((state) => state.getTotal())

  return (
    <aside className={`${styles.card} ${styles.summaryCard}`}>
      <h2 className={styles.summaryTitle}>Order Summary</h2>
      <p className={styles.summaryHint}>Everything updates in real time as you adjust quantities and promos.</p>

      <div className={styles.divider} />

      <PromoCodeInput subtotal={subtotal} />

      <div className={styles.divider} />

      <div className={styles.summaryRows}>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <strong>{formatCurrencyAmount(subtotal)}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Discount {appliedPromo ? `(${appliedPromo.code})` : ''}</span>
          <strong>{promoDiscount > 0 ? `- ${formatCurrencyAmount(promoDiscount)}` : formatCurrencyAmount(0)}</strong>
        </div>
        <div className={styles.summaryRow}>
          <span>Handling Charge ({FIXED_HANDLING_CHARGE_PERCENT}%)</span>
          <strong>{formatCurrencyAmount(handlingCharge)}</strong>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.summaryTotal}>
        <span>Total</span>
        <span>{formatCurrencyAmount(total)}</span>
      </div>

      <p className={styles.summaryNote}>
        A fixed 5% handling charge is applied automatically on the discounted subtotal.
      </p>

      <div className={styles.divider} />

      <CheckoutButton />
    </aside>
  )
}
