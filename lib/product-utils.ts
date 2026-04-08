import type { ProductDocument } from '@/hooks/use-products-query'

export interface ProductSizeOption {
  value: string
  label: string
  multiplier: number
  surcharge: number
}

export function splitCommaSeparated(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatPrice(price?: string, unit?: string) {
  if (typeof Number(price) !== 'number') {
    return 'Price unavailable'
  }

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(price))

  return unit ? `${formattedPrice} / ${unit}` : formattedPrice
}

export function getPrimaryImage(product: Pick<ProductDocument, 'image' | 'image_list_comma_separated_link'>) {
  if (product.image) {
    return product.image
  }

  return splitCommaSeparated(product.image_list_comma_separated_link)[0] ?? '/placeholder.jpg'
}

export function getProductSummary(product: Pick<ProductDocument, 'description' | 'alias_name' | 'type'>) {
  return product.description ?? product.alias_name ?? product.type ?? 'Authentic Himalayan product.'
}

export function getProductSizeOptions(unit?: string): ProductSizeOption[] {
  const normalizedUnit = unit?.trim().toLowerCase()

  if (!normalizedUnit) {
    return []
  }

  if (/\b(kg|kgs|kilogram|kilograms|kilo)\b/.test(normalizedUnit)) {
    return [
      { value: 'kg', label: 'kg', multiplier: 1, surcharge: 0 },
      { value: '500gm', label: '500gm', multiplier: 0.5, surcharge: 25 },
      { value: '250gm', label: '250gm', multiplier: 0.25, surcharge: 15 },
    ]
  }

  if (/\b(l|ltr|ltrs|litre|litres|liter|liters)\b/.test(normalizedUnit)) {
    return [
      { value: 'L', label: 'L', multiplier: 1, surcharge: 0 },
      { value: '500ml', label: '500ml', multiplier: 0.5, surcharge: 25 },
      { value: '250ml', label: '250ml', multiplier: 0.25, surcharge: 15 },
    ]
  }

  return []
}

export function getVariantPrice(price?: string, multiplier = 1, surcharge = 0) {
  if (!price) {
    return price
  }

  const numericPrice = Number(price)

  if (Number.isNaN(numericPrice)) {
    return price
  }

  return String(numericPrice * multiplier + surcharge)
}
