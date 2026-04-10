import type { ProductDocument, ProductNumericValue } from '@/lib/product-types'

export interface ProductSizeOption {
  value: string
  label: string
  multiplier: number
  surcharge: number
}

export interface ProductVideoPresentation {
  kind: 'embed' | 'direct'
  src: string
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

export function splitContentList(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function toNumber(value?: ProductNumericValue | null) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const sanitizedValue = value.replace(/[^0-9.-]/g, '')
  const numericValue = Number(sanitizedValue)

  return Number.isFinite(numericValue) ? numericValue : null
}

export function formatPrice(price?: ProductNumericValue, unit?: string) {
  const numericPrice = toNumber(price)

  if (numericPrice === null) {
    return 'Price unavailable'
  }

  const formattedPrice = formatCurrencyAmount(numericPrice, 0)

  return unit ? `${formattedPrice} / ${unit}` : formattedPrice
}

export function formatCurrencyAmount(amount: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
    minimumFractionDigits: Number.isInteger(amount) || maximumFractionDigits === 0 ? 0 : 2,
  }).format(amount)
}

function normalizeImageCandidate(image?: string) {
  if (!image) {
    return null
  }

  const trimmedImage = image.trim()

  if (!trimmedImage) {
    return null
  }

  if (/^https?:\/\/.+\/vie(\?|$)/i.test(trimmedImage)) {
    return trimmedImage.replace(/\/vie(\?|$)/i, '/view$1')
  }

  if (
    trimmedImage.startsWith('http://') ||
    trimmedImage.startsWith('https://') ||
    trimmedImage.startsWith('/') ||
    trimmedImage.startsWith('data:') ||
    trimmedImage.startsWith('blob:')
  ) {
    return trimmedImage
  }

  return null
}

export function getPrimaryImage(product: Pick<ProductDocument, 'image' | 'image_list_comma_separated_link'>) {
  const primaryImage = normalizeImageCandidate(product.image)

  if (primaryImage) {
    return primaryImage
  }

  return (
    splitCommaSeparated(product.image_list_comma_separated_link)
      .map((image) => normalizeImageCandidate(image))
      .find((image): image is string => Boolean(image)) ?? '/placeholder.jpg'
  )
}

export function getProductGalleryImages(product: Pick<ProductDocument, 'image' | 'image_list_comma_separated_link'>) {
  const galleryImages = [product.image, ...splitCommaSeparated(product.image_list_comma_separated_link)]
    .map((image) => normalizeImageCandidate(image))
    .filter((image): image is string => Boolean(image))

  return Array.from(new Set(galleryImages)).length > 0 ? Array.from(new Set(galleryImages)) : ['/placeholder.jpg']
}

export function getProductSummary(product: Pick<ProductDocument, 'description' | 'alias_name' | 'type'>) {
  return product.description ?? product.alias_name ?? product.type ?? 'Authentic Himalayan product.'
}

export function slugifyProductValue(value?: string) {
  if (!value) {
    return 'product'
  }

  const normalizedValue = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalizedValue || 'product'
}

export function getProductSlug(product: Pick<ProductDocument, '$id' | 'name' | 'alias_name'>) {
  const label = product.alias_name ?? product.name ?? 'product'
  return `${slugifyProductValue(label)}`
}

export function getProductIdFromSlug(slug: string) {
  if (!slug) {
    return ''
  }

  const slugParts = slug.split('--')
  return slugParts[slugParts.length - 1] ?? slug
}

export function isProductInStock(product: Pick<ProductDocument, 'in_stock'>) {
  return product.in_stock !== false
}

export function getProductRating(product: Pick<ProductDocument, 'rating'>) {
  const rating = toNumber(product.rating)

  if (rating === null) {
    return 0
  }

  return Math.min(5, Math.max(0, rating))
}

export function getProductHighlights(
  product: Pick<ProductDocument, 'key_higlights_comma_separated' | 'key_highlights_comma_separated'>
) {
  return splitContentList(product.key_highlights_comma_separated ?? product.key_higlights_comma_separated)
}

export function getProductIngredients(product: Pick<ProductDocument, 'ingredients'>) {
  return splitContentList(product.ingredients)
}

export function getProductKeywords(product: Pick<ProductDocument, 'keywords'>) {
  return splitContentList(product.keywords)
}

export function toSerializableProduct(product: ProductDocument): ProductDocument {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    image: product.image,
    alias_name: product.alias_name,
    description: product.description,
    history: product.history,
    calories: product.calories,
    fat: product.fat,
    carbs: product.carbs,
    protein: product.protein,
    storage: product.storage,
    preparation: product.preparation,
    review: product.review,
    unit: product.unit,
    nutrition_fact: product.nutrition_fact,
    seasonal: product.seasonal,
    type: product.type,
    in_stock: product.in_stock,
    rating: product.rating,
    image_list_comma_separated_link: product.image_list_comma_separated_link,
    key_higlights_comma_separated: product.key_higlights_comma_separated,
    key_highlights_comma_separated: product.key_highlights_comma_separated,
    ingredients: product.ingredients,
    shelf_life: product.shelf_life,
    texture: product.texture,
    taste_note: product.taste_note,
    method: product.method,
    village: product.village,
    keywords: product.keywords,
    video: product.video,
    $id: product.$id,
    $sequence: product.$sequence,
    $createdAt: product.$createdAt,
    $updatedAt: product.$updatedAt,
    $permissions: Array.isArray(product.$permissions) ? [...product.$permissions] : [],
    $databaseId: product.$databaseId,
    $collectionId: product.$collectionId,
  }
}

export function toSerializableProducts(products: ProductDocument[]) {
  return products.map((product) => toSerializableProduct(product))
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

export function getVariantPrice(price?: ProductNumericValue, multiplier = 1, surcharge = 0) {
  if (price === undefined || price === null || price === '') {
    return price
  }

  const numericPrice = toNumber(price)

  if (numericPrice === null) {
    return price
  }

  return String(numericPrice * multiplier + surcharge)
}

export function getProductVideoPresentation(videoUrl?: string): ProductVideoPresentation | null {
  if (!videoUrl) {
    return null
  }

  const normalizedUrl = videoUrl.trim()

  if (!normalizedUrl) {
    return null
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(normalizedUrl)) {
    return {
      kind: 'direct',
      src: normalizedUrl,
    }
  }

  try {
    const parsedUrl = new URL(normalizedUrl)
    const host = parsedUrl.hostname.replace(/^www\./, '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsedUrl.searchParams.get('v')

      if (videoId) {
        return {
          kind: 'embed',
          src: `https://www.youtube.com/embed/${videoId}`,
        }
      }
    }

    if (host === 'youtu.be') {
      const videoId = parsedUrl.pathname.replace('/', '')

      if (videoId) {
        return {
          kind: 'embed',
          src: `https://www.youtube.com/embed/${videoId}`,
        }
      }
    }

    if (host === 'vimeo.com') {
      const videoId = parsedUrl.pathname.split('/').filter(Boolean)[0]

      if (videoId) {
        return {
          kind: 'embed',
          src: `https://player.vimeo.com/video/${videoId}`,
        }
      }
    }
  } catch {
    return null
  }

  return null
}

export function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim()
}

export function truncateText(value?: string, maxLength = 160) {
  if (!value) {
    return ''
  }

  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}
