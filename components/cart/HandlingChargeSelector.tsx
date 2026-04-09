'use client'

import { formatCurrencyAmount } from '@/lib/product-utils'
import { useCartStore } from '@/store/cartStore'

import styles from './cart.module.css'

interface HandlingChargeSelectorProps {
  discountedSubtotal: number
}

export function HandlingChargeSelector({ discountedSubtotal }: HandlingChargeSelectorProps) {
  const handlingChargePercent = useCartStore((state) => state.handlingChargePercent)
  const setHandlingCharge = useCartStore((state) => state.setHandlingCharge)

  const options = [5, 10] as const

  return (
    <div className={styles.selectorPanel}>
      <div className={styles.panelHeading}>
        <div>
          <h3 className={styles.panelTitle}>Handling Charge</h3>
          <p className={styles.panelSubtitle}>Choose how much care and packing you want us to add.</p>
        </div>
      </div>

      <div className={styles.selectorGrid}>
        {options.map((percent) => {
          const amount = (discountedSubtotal * percent) / 100

          return (
            <button
              key={percent}
              type="button"
              className={`${styles.selectorOption} ${handlingChargePercent === percent ? styles.selectorOptionActive : ''}`}
              onClick={() => setHandlingCharge(percent)}
            >
              <span className={styles.selectorCopy}>
                <span className={styles.selectorLabel}>{percent}% handling</span>
                <span className={styles.selectorDescription}>
                  {formatCurrencyAmount(amount)} ({percent}% of {formatCurrencyAmount(discountedSubtotal)})
                </span>
              </span>
              <span className={styles.selectorAmount}>{formatCurrencyAmount(amount)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
