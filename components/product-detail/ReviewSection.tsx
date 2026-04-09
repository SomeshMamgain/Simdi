import { MessageCircleMore } from 'lucide-react'

import type { ProductDocument } from '@/lib/product-types'

import styles from './ProductDetailPage.module.css'

interface ReviewSectionProps {
  product: ProductDocument
}

export function ReviewSection({ product }: ReviewSectionProps) {
  return (
    <div>
      {product.review ? (
        <div className={styles.quote}>
          <span className={styles.quoteBody}>{product.review}</span>
        </div>
      ) : (
        <div className={styles.quote}>
          <span className={styles.quoteBody}>
            <MessageCircleMore size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Customer feedback for this product will appear here once reviews are shared.
          </span>
        </div>
      )}
    </div>
  )
}
