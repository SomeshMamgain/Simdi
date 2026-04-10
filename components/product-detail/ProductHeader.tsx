import { Leaf, MapPin, Sparkles, Star } from 'lucide-react'

import type { ProductDocument } from '@/lib/product-types'
import { getProductRating, isProductInStock } from '@/lib/product-utils'

import styles from './ProductDetailPage.module.css'

interface ProductHeaderProps {
  product: ProductDocument
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const rating = getProductRating(product)
  const displayRating = rating > 0 ? rating.toFixed(1) : null
  const inStock = isProductInStock(product)

  return (
    <div>
      {product.alias_name ? <p className={styles.eyebrow}>{product.alias_name}</p> : null}

      <h1 className={styles.title}>{product.name ?? 'Untitled product'}</h1>

      <div className={styles.ratingRow}>
        <div className={styles.stars} aria-label={displayRating ? `${displayRating} out of 5 stars` : 'No ratings yet'}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={18}
              fill={index < Math.round(rating) ? '#D0A869' : 'transparent'}
              color={index < Math.round(rating) ? '#D0A869' : '#C8B28B'}
            />
          ))}
        </div>
        <span className={styles.ratingText}>{displayRating ? `${displayRating} / 5 rating` : 'Freshly added to the collection'}</span>
      </div>

      <div className={styles.badgeRow}>
        <span className={`${styles.badge} ${inStock ? styles.badgeStock : styles.badgeOut}`}>
          <Sparkles size={15} />
          {inStock ? 'In stock' : 'Out of stock'}
        </span>

        {product.seasonal ? (
          <span className={`${styles.badge} ${styles.badgeSeasonal}`}>
            <Leaf size={15} />
            Seasonal
          </span>
        ) : null}

        {product.type ? <span className={`${styles.badge} ${styles.badgeNeutral}`}>{product.type}</span> : null}
      </div>

      <div className={styles.originMeta}>
        <div className={styles.originCard}>
          <span className={styles.originLabel}>Origin</span>
          <span className={styles.originValue}>{product.village ?? 'Himalayan villages of Uttarakhand'}</span>
        </div>

        <div className={styles.originCard}>
          <span className={styles.originLabel}>Product Type</span>
          <span className={styles.originValue}>{product.type ?? 'Artisanal specialty'}</span>
        </div>
      </div>

      {product.description ? (
        <p className={styles.subtitle} dangerouslySetInnerHTML={{ __html: product.description }} />
      ) : null}

      {product.village ? (
        <div className={styles.ratingRow}>
          <MapPin size={16} color="#B58E58" />
          <span className={styles.ratingText}>Sourced from {product.village}</span>
        </div>
      ) : null}
    </div>
  )
}
