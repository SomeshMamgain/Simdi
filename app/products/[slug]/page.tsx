import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductDetailPage } from '@/components/product-detail/ProductDetailPage'
import { getProductBySlug, getRelatedProducts } from '@/lib/product-service'
import type { ProductDocument } from '@/lib/product-types'
import { getReviewsByProductSlug } from '@/lib/review-service'
import { DEFAULT_OG_IMAGE, buildMetadata, getCanonicalUrl, mergeKeywords } from '@/lib/seo'
import {
  cleanProductText,
  getPrimaryImage,
  getProductGalleryImages,
  getProductKeywords,
  getProductSlug,
  stripHtml,
  toNumber,
  truncateText,
} from '@/lib/product-utils'

type ProductDetailRouteProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

const PRODUCT_REVIEW_SCHEMA_LIMIT = 5
const DEFAULT_PRODUCT_GEO_POSITION = '30.0668;79.0193'
const DEFAULT_PRODUCT_ICBM = '30.0668, 79.0193'

function getPlainText(value?: string | null) {
  return cleanProductText(stripHtml(value)).replace(/\s+/g, ' ').trim()
}

function getSeoProductName(product: Pick<ProductDocument, 'name' | 'alias_name'>) {
  return getPlainText(product.name) || getPlainText(product.alias_name) || 'Simdi Product'
}

function getSeoProductType(product: Pick<ProductDocument, 'name' | 'alias_name' | 'type'>) {
  const type = getPlainText(product.type)
  const name = getSeoProductName(product).toLowerCase()

  if (!type || name.includes(type.toLowerCase())) {
    return ''
  }

  return type
}

function getSeoProductLocation(product: Pick<ProductDocument, 'village'>) {
  const village = getPlainText(product.village)
  return village ? `${village}, Uttarakhand, India` : 'Uttarakhand, India'
}

function getSeoProductImage(product: Pick<ProductDocument, 'image' | 'image_list_comma_separated_link'>) {
  const primaryImage = getPrimaryImage(product)
  return primaryImage === '/placeholder.jpg' ? DEFAULT_OG_IMAGE : primaryImage
}

function getStructuredDataImages(product: Pick<ProductDocument, 'image' | 'image_list_comma_separated_link'>) {
  const images = getProductGalleryImages(product).filter((image) => image !== '/placeholder.jpg')
  const fallbackImage = getSeoProductImage(product)

  return Array.from(new Set(images.length > 0 ? images : [fallbackImage]))
}

function getProductBaseDescription(
  product: Pick<ProductDocument, 'name' | 'alias_name' | 'description' | 'history'>
) {
  return (
    getPlainText(product.description) ||
    getPlainText(product.alias_name) ||
    getPlainText(product.history) ||
    `Authentic Himalayan product from Simdi.`
  )
}

function buildProductSeoTitle(
  product: Pick<ProductDocument, 'name' | 'alias_name' | 'type' | 'village'>
) {
  const productName = getSeoProductName(product)
  const productType = getSeoProductType(product)
  const location = getSeoProductLocation(product)
  const preferredTitle = `Buy ${productName} Online | ${productType || 'Himalayan Product'} from ${location} | Simdi`
  const mediumTitle = `Buy ${productName} Online from Uttarakhand | Simdi`
  const shortTitle = `Buy ${productName} Online | Simdi`

  if (preferredTitle.length <= 78) {
    return preferredTitle
  }

  if (mediumTitle.length <= 72) {
    return mediumTitle
  }

  return truncateText(shortTitle, 72)
}

function buildProductSeoDescription(
  product: Pick<ProductDocument, 'name' | 'alias_name' | 'type' | 'village' | 'description' | 'history'>
) {
  const productName = getSeoProductName(product)
  const productType = getSeoProductType(product)
  const location = getSeoProductLocation(product)
  const benefits = productType
    ? `${productType} sourced from the Himalayas with trusted quality and pan-India delivery.`
    : 'Authentic Himalayan quality with trusted sourcing and pan-India delivery.'

  return truncateText(`Buy ${productName} online from ${location}. ${benefits} Shop now on Simdi.`, 150)
}

function buildProductFaqSchema(
  product: Pick<ProductDocument, 'village'>,
  productName: string,
  structuredDescription: string
) {
  const location = getSeoProductLocation(product)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${productName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: structuredDescription,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${productName} authentic?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${productName} is sourced directly from ${location} through Simdi's trusted village network.`,
        },
      },
      {
        '@type': 'Question',
        name: `How to buy ${productName} online?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can order ${productName} online from Simdi with pan-India delivery and careful packaging for freshness.`,
        },
      },
    ],
  }
}

export async function generateMetadata({ params }: ProductDetailRouteProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return buildMetadata({
      title: 'Product Not Found | Simdi',
      description: 'The requested product could not be found in the Simdi collection.',
      path: `/products/${slug}`,
      index: false,
      follow: false,
    })
  }

  const title = buildProductSeoTitle(product)
  const description = buildProductSeoDescription(product)
  const keywords = mergeKeywords(getProductKeywords(product))
  const image = getSeoProductImage(product)
  const canonicalPath = `/products/${getProductSlug(product)}`
  const location = getSeoProductLocation(product)

  return buildMetadata({
    title,
    description,
    keywords,
    path: canonicalPath,
    images: [image],
    imageAlt: `${getSeoProductName(product)} from ${location}`,
    category: getPlainText(product.type) || 'food',
    other: {
      'geo.region': 'IN-UK',
      'geo.placename': location,
      'geo.position': DEFAULT_PRODUCT_GEO_POSITION,
      ICBM: DEFAULT_PRODUCT_ICBM,
    },
  })
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const canonicalSlug = getProductSlug(product)

  if (slug !== canonicalSlug) {
    permanentRedirect(`/products/${canonicalSlug}`)
  }

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product, 4),
    getReviewsByProductSlug(canonicalSlug),
  ])
  const canonicalPath = `/products/${canonicalSlug}`
  const canonicalUrl = getCanonicalUrl(canonicalPath)
  const numericPrice = toNumber(product.price)
  const normalizedPrice = numericPrice === null ? null : Number(numericPrice.toFixed(2))
  const reviewCount = reviews.length
  const averageRating = reviewCount
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
    : 0
  const normalizedAverageRating = reviewCount > 0 ? Number(averageRating.toFixed(1)) : 0
  const productName = getSeoProductName(product)
  const structuredDescription = getProductBaseDescription(product)
  const structuredImages = getStructuredDataImages(product)
  const structuredReviews = reviews
    .filter((review) => Boolean(getPlainText(review.review) || getPlainText(review.title)))
    .slice(0, PRODUCT_REVIEW_SCHEMA_LIMIT)
  const faqSchema = buildProductFaqSchema(product, productName, structuredDescription)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    image: structuredImages,
    description: structuredDescription,
    sku: product.id ?? product.$id,
    category: getPlainText(product.type) || 'Himalayan product',
    brand: {
      '@type': 'Brand',
      name: 'Simdi',
    },
    seller: {
      '@type': 'Organization',
      name: 'Simdi',
    },
    url: canonicalUrl,
    ...(normalizedPrice !== null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: normalizedPrice,
            availability:
              product.in_stock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            url: canonicalUrl,
          },
        }
      : {}),
    ...(reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: normalizedAverageRating,
            reviewCount,
          },
        }
      : {}),
    ...(structuredReviews.length > 0
      ? {
          review: structuredReviews.map((review) => ({
            '@type': 'Review',
            ...(review.title ? { name: review.title } : {}),
            author: {
              '@type': 'Person',
              name: review.user_name || 'Customer',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
              bestRating: 5,
            },
            ...(review.review ? { reviewBody: review.review } : {}),
            datePublished: review.$createdAt,
          })),
        }
      : {}),
  }

  return (
    <div className="site-page-shell">
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ProductDetailPage
        product={product}
        relatedProducts={relatedProducts}
        reviews={reviews}
      />

      <Footer />
    </div>
  )
}
