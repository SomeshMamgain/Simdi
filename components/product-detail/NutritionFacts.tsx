import type { ProductDocument } from '@/lib/product-types'
import { toNumber } from '@/lib/product-utils'

import styles from './ProductDetailPage.module.css'

interface NutritionFactsProps {
  product: ProductDocument
}

function formatMetricValue(value: ProductDocument['calories'] | ProductDocument['fat'], suffix: string) {
  const numericValue = toNumber(value)

  if (numericValue === null) {
    return 'Not available'
  }

  return `${numericValue}${suffix}`
}

export function NutritionFacts({ product }: NutritionFactsProps) {
  const rows = [
    { label: 'Serving unit', value: product.unit ?? 'Per listed serving' },
    { label: 'Calories', value: formatMetricValue(product.calories, ' kcal') },
    { label: 'Fat', value: formatMetricValue(product.fat, ' g') },
    { label: 'Carbohydrates', value: formatMetricValue(product.carbs, ' g') },
    { label: 'Protein', value: formatMetricValue(product.protein, ' g') },
  ]

  return (
    <div className={styles.nutritionTable}>
      {rows.map((row) => (
        <div key={row.label} className={styles.nutritionRow}>
          <span className={styles.nutritionLabel}>{row.label}</span>
          <span className={styles.nutritionValue}>{row.value}</span>
        </div>
      ))}

      {product.nutrition_fact ? (
        <div className={styles.quote}>
          <span className={styles.quoteBody} dangerouslySetInnerHTML={{ __html: product.nutrition_fact }} />
        </div>
      ) : null}
    </div>
  )
}
