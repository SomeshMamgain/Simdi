'use client'

import Link from 'next/link'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'

import type { ProductDocument } from '@/lib/product-types'
import { useCartStore } from '@/store/cartStore'

import { CartEmpty } from './CartEmpty'
import { CartItemCard } from './CartItemCard'
import { OrderSummary } from './OrderSummary'
import styles from './cart.module.css'

interface CartPageProps {
  suggestions: ProductDocument[]
}

export function CartPage({ suggestions }: CartPageProps) {
  const hasHydrated = useCartStore((state) => state.hasHydrated)
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.getItemCount())
  const clearCart = useCartStore((state) => state.clearCart)

  if (!hasHydrated) {
    return (
      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>SHOPPING CART</span>
              <h1 className={styles.title}>Loading your saved cart</h1>
              <p className={styles.subtitle}>We&apos;re restoring your selected items, promo code, and fixed handling charge.</p>
            </div>
          </div>
          <div className={styles.layout}>
            <div className={styles.placeholder} />
            <div className={styles.placeholder} />
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.shell}>
          <CartEmpty suggestions={suggestions} />
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>SHOPPING CART</span>
            <h1 className={styles.title}>Ready when you are</h1>
            <p className={styles.subtitle}>
              Review the products you&apos;ve picked, apply a promo, and continue to secure payment with Razorpay.
            </p>
          </div>
          <div className={styles.countPill}>{itemCount} item{itemCount === 1 ? '' : 's'} in cart</div>
        </div>

        <div className={styles.layout}>
          <div className={`${styles.card} ${styles.itemsCard}`}>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.actionsRow}>
              <Link href="/products" className={styles.continueLink}>
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>

              <button type="button" className={styles.ghostButton} onClick={() => clearCart()}>
                <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
                Clear Cart
              </button>
            </div>
          </div>

          <OrderSummary />
        </div>
      </div>
    </section>
  )
}
