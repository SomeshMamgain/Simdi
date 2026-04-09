'use client'

import { Trash2 } from 'lucide-react'

import { formatCurrencyAmount } from '@/lib/product-utils'
import { useCartStore } from '@/store/cartStore'
import type { CartItem } from '@/types/cart'

import { QuantitySelector } from '../products/QuantitySelector'
import styles from './cart.module.css'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const hasStockWarning = typeof item.stock === 'number' && item.quantity > item.stock
  const isOutOfStock = item.inStock === false || item.stock === 0
  const itemTotal = item.price * item.quantity

  return (
    <article className={styles.itemCard}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />

      <div className={styles.itemBody}>
        <div className={styles.itemHeading}>
          <div>
            <h2 className={styles.itemName}>{item.name}</h2>
            <div className={styles.itemMeta}>
              {item.unit ? <div>{item.unit}</div> : null}
              <div>{formatCurrencyAmount(item.price)} per unit</div>
            </div>
          </div>

          <button type="button" className={styles.removeButton} onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>
            <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Remove
          </button>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.priceTag}>{formatCurrencyAmount(item.price)}</span>
          <span className={styles.mutedMeta}>{item.quantity} selected</span>
        </div>

        {isOutOfStock ? (
          <div className={styles.warning}>This item is currently out of stock. You can remove it or keep it for later.</div>
        ) : null}

        {hasStockWarning ? (
          <div className={styles.warning}>
            You selected {item.quantity}, but only {item.stock} are available right now.
          </div>
        ) : null}

        <div className={styles.itemFooter}>
          <QuantitySelector
            value={item.quantity}
            onChange={(nextValue) => updateQuantity(item.id, nextValue)}
            className={styles.quantityControl}
            buttonClassName={styles.quantityButton}
            inputClassName={styles.quantityInput}
          />

          <div className={styles.itemTotal}>
            <span className={styles.itemTotalLabel}>Line Total</span>
            <strong className={styles.itemTotalValue}>{formatCurrencyAmount(itemTotal)}</strong>
          </div>
        </div>
      </div>
    </article>
  )
}
