'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

import type { ProductDocument } from '@/lib/product-types'
import { formatPrice, getPrimaryImage, getProductSlug, getProductSummary } from '@/lib/product-utils'

import styles from './cart.module.css'

interface CartEmptyProps {
  suggestions: ProductDocument[]
}

export function CartEmpty({ suggestions }: CartEmptyProps) {
  return (
    <div className={styles.card}>
      <div className={styles.emptyState}>
        <ShoppingBag size={42} color="#11522b" />
        <h1 className={styles.emptyTitle}>Your cart is waiting for something special</h1>
        <p className={styles.emptyCopy}>
          Add a few mountain-made favorites and we&apos;ll keep everything ready here, including promo codes and the
          fixed 5% handling charge.
        </p>

        <div className={styles.emptyActions}>
          <Link href="/products" className={styles.primaryLink}>
            Explore Products
          </Link>
          <Link href="/" className={styles.secondaryLink}>
            Return Home
          </Link>
        </div>

        {suggestions.length > 0 ? (
          <div className={styles.suggestionsGrid}>
            {suggestions.map((product) => (
              <Link key={product.$id} href={`/products/${getProductSlug(product)}`} className={styles.suggestionCard}>
                <img
                  src={getPrimaryImage(product)}
                  alt={product.name ?? 'Suggested product'}
                  className={styles.suggestionImage}
                  loading="lazy"
                />
                <div className={styles.suggestionBody}>
                  <h2 className={styles.suggestionName}>{product.name ?? 'Untitled product'}</h2>
                  <p className={styles.suggestionMeta}>{getProductSummary(product)}</p>
                  <div className={styles.suggestionPrice}>
                    {formatPrice(product.price, product.unit)}
                    <ArrowRight size={14} style={{ marginLeft: '8px', verticalAlign: 'text-bottom' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
