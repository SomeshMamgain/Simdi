import Link from 'next/link'

import styles from './orders.module.css'

interface EmptyOrderStateProps {
  title?: string
  copy?: string
  ctaLabel?: string
  ctaHref?: string
}

export function EmptyOrderState({
  title = `You haven't placed any orders yet`,
  copy = 'When you complete a checkout, your orders will show up here with tracking, payment status, and full receipt details.',
  ctaLabel = 'Continue Shopping',
  ctaHref = '/products',
}: EmptyOrderStateProps) {
  return (
    <div className={`${styles.panel} ${styles.emptyState}`}>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyCopy}>{copy}</p>
      <div className={styles.emptyActions}>
        <Link href={ctaHref} className={styles.linkButton}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}
