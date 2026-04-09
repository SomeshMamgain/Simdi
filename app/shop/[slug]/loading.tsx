import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Suspense } from 'react'

import styles from '@/components/product-detail/ProductDetailPage.module.css'

export default function ProductDetailLoading() {
  return (
    <div className="site-page-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <div className={styles.page}>
        <div className={styles.shell}>
          <div className={styles.breadcrumbs}>
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span>Loading</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={`${styles.panel} ${styles.galleryWrap} ${styles.skeleton}`}>
              <div className={styles.skeletonBlock} style={{ minHeight: '480px' }} />
            </div>

            <div className={`${styles.panel} ${styles.summaryPanel}`}>
              <div className={`${styles.skeletonBlock} ${styles.skeleton}`} style={{ height: '18px', width: '40%' }} />
              <div className={`${styles.skeletonBlock} ${styles.skeleton}`} style={{ height: '58px', width: '80%' }} />
              <div className={`${styles.skeletonBlock} ${styles.skeleton}`} style={{ height: '24px', width: '45%' }} />
              <div className={`${styles.skeletonBlock} ${styles.skeleton}`} style={{ height: '96px', width: '100%' }} />
              <div className={`${styles.skeletonBlock} ${styles.skeleton}`} style={{ height: '280px', width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
