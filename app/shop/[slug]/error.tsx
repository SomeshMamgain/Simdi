'use client'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'

import styles from '@/components/product-detail/ProductDetailPage.module.css'

export default function ProductDetailError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="site-page-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={`${styles.panel} ${styles.statusCard}`}>
            <h1 className={styles.statusTitle}>We couldn&apos;t load this product</h1>
            <p className={styles.statusBody}>
              Something went wrong while fetching the product details. You can try again or head back to the product listing.
            </p>
            <div>
              <button type="button" className={styles.statusAction} onClick={reset}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
