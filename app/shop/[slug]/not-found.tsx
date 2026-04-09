import Link from 'next/link'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'

import styles from '@/components/product-detail/ProductDetailPage.module.css'

export default function ProductDetailNotFound() {
  return (
    <div className="site-page-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={`${styles.panel} ${styles.statusCard}`}>
            <h1 className={styles.statusTitle}>Product not found</h1>
            <p className={styles.statusBody}>
              The product you were looking for is no longer available or the link may have changed.
            </p>
            <Link href="/shop" className={styles.statusAction}>
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
