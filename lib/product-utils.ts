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
  const raw = product.description ?? product.alias_name ?? product.type ?? 'Authentic Himalayan product.'
  return cleanProductText(raw)
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

function generateFallbackKeywords(
  product: Pick<ProductDocument, 'name' | 'alias_name' | 'type' | 'village' | 'description' | 'keywords'>
): string[] {
  const keywords: string[] = []
  const name = product.name?.trim()
  const alias = product.alias_name?.trim()
  const type = product.type?.trim()
  const village = product.village?.trim()
  const searchableText = [name, alias, type, village, product.description, product.keywords].filter(Boolean).join(' ').toLowerCase()
  const primaryLabel = alias && alias.toLowerCase() !== name?.toLowerCase() ? alias : name ?? type ?? 'Himalayan product'
  const normalizedType = type && type.toLowerCase() !== primaryLabel.toLowerCase() ? type : null

  function pushKeyword(value?: string) {
    const normalizedKeyword = value?.trim().replace(/\s+/g, ' ')

    if (!normalizedKeyword) {
      return
    }

    if (!keywords.some((keyword) => keyword.toLowerCase() === normalizedKeyword.toLowerCase())) {
      keywords.push(normalizedKeyword)
    }
  }

  if (name) {
    pushKeyword(`buy ${name} online`)
    pushKeyword(`${name} online India`)
    pushKeyword(`${name} price India`)
    pushKeyword(`${name} from Uttarakhand`)
  }

  if (alias && alias.toLowerCase() !== name?.toLowerCase()) {
    pushKeyword(`buy ${alias} online`)
    pushKeyword(`${alias} online India`)
  }

  if (normalizedType) {
    pushKeyword(`buy ${normalizedType} online`)
    pushKeyword(`${normalizedType} from Uttarakhand`)
  }

  if (village) {
    pushKeyword(`${primaryLabel} from ${village}`)
  }

  if (/\borganic\b/.test(searchableText)) {
    pushKeyword(`organic ${primaryLabel}`)
  }

  if (/\ba2\b/.test(searchableText)) {
    pushKeyword(`buy A2 ${primaryLabel} online`)
  }

  pushKeyword(`buy ${primaryLabel} online`)
  pushKeyword(`${primaryLabel} Uttarakhand`)
  pushKeyword('authentic Himalayan products online')
  pushKeyword('Uttarakhand products online')
  pushKeyword('Simdi online store')

  return keywords.slice(0, 12)
}

export function getProductKeywords(
  product: Pick<ProductDocument, 'keywords' | 'name' | 'alias_name' | 'type' | 'village' | 'description'>
) {
  const explicit = splitContentList(product.keywords)
  const raw = explicit.length > 0 ? [...explicit, ...generateFallbackKeywords(product)] : generateFallbackKeywords(product)
  const seen = new Set<string>()

  return raw.filter((keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword || seen.has(normalizedKeyword)) {
      return false
    }

    seen.add(normalizedKeyword)
    return true
  }).slice(0, 12)
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
      { value: '500gm', label: '500gm', multiplier: 0.5, surcharge: 25 },
      { value: 'kg', label: 'kg', multiplier: 1, surcharge: 0 },
    ]
  }

  if (/\b(l|ltr|ltrs|litre|litres|liter|liters)\b/.test(normalizedUnit)) {
    return [
      { value: '500ml', label: '500ml', multiplier: 0.5, surcharge: 25 },
      { value: 'L', label: 'L', multiplier: 1, surcharge: 0 },
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

/**
 * Strips leading and trailing double/smart quotes from product text.
 * Handles both regular ("…") and Unicode smart quotes ("…", „…", etc.)
 */
export function cleanProductText(text?: string | null): string {
  if (!text) return ''
  return text
    .replace(/^[\u201C\u201D\u201E\u201F\u2033\u2036\u0022]+/g, '')
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036\u0022]+$/g, '')
    .trim()
}

export function stripHtml(html?: string | null) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim()
}

export function truncateText(value?: string, maxLength = 160) {
  if (!value) {
    return ''
  }

  const normalizedValue = stripHtml(cleanProductText(value)).replace(/\s+/g, ' ').trim()

  if (normalizedValue.length <= maxLength) {
    return normalizedValue
  }

  const sentenceSlice = normalizedValue.slice(0, maxLength)
  const sentenceEndIndex = Math.max(
    sentenceSlice.lastIndexOf('.'),
    sentenceSlice.lastIndexOf('!'),
    sentenceSlice.lastIndexOf('?')
  )

  if (sentenceEndIndex >= Math.floor(maxLength * 0.6)) {
    return sentenceSlice.slice(0, sentenceEndIndex + 1).trim()
  }

  const wordBoundaryIndex = sentenceSlice.lastIndexOf(' ')

  if (wordBoundaryIndex >= Math.floor(maxLength * 0.6)) {
    return `${sentenceSlice.slice(0, wordBoundaryIndex).trim()}…`
  }

  return `${sentenceSlice.trimEnd()}…`
}