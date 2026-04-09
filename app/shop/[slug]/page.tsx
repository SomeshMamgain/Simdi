import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductDetailPage } from '@/components/product-detail/ProductDetailPage'
import { getProductBySlug, getRelatedProducts } from '@/lib/product-service'
import { getProductGalleryImages, getProductKeywords, getProductRating, getProductSlug, toNumber, truncateText } from '@/lib/product-utils'
import { notFound, permanentRedirect } from 'next/navigation'

type ProductDetailRouteProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: ProductDetailRouteProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | Simdi',
      description: 'The requested product could not be found in the Simdi collection.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `${product.name ?? 'Product'} | Simdi`
  const description = truncateText(
    product.description ??
      product.alias_name ??
      product.history ??
      `Explore ${product.name ?? 'this product'} from Simdi's Himalayan collection.`,
    160
  )
  const keywords = getProductKeywords(product)
  const images = getProductGalleryImages(product)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const canonicalPath = `/shop/${getProductSlug(product)}`

  return {
    title,
    description,
    keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: siteUrl
      ? {
          canonical: new URL(canonicalPath, siteUrl).toString(),
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      url: siteUrl ? new URL(canonicalPath, siteUrl).toString() : canonicalPath,
      images: images.map((image) => ({
        url: image,
        alt: product.name ?? 'Simdi product image',
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}

export default async function ProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)


  if (!product) {
    notFound()
  }

  const canonicalSlug = getProductSlug(product)

  if (slug !== canonicalSlug) {
    permanentRedirect(`/shop/${canonicalSlug}`)
  }

  const relatedProducts = await getRelatedProducts(product, 4)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const canonicalPath = `/shop/${canonicalSlug}`
  const numericPrice = toNumber(product.price)
  const rating = getProductRating(product)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name ?? 'Simdi Product',
    image: getProductGalleryImages(product),
    description:
      product.description ??
      product.alias_name ??
      product.history ??
      'Authentic Himalayan product from the Simdi collection.',
    sku: product.id ?? product.$id,
    category: product.type,
    brand: {
      '@type': 'Brand',
      name: 'Simdi',
    },
    ...(siteUrl
      ? {
          url: new URL(canonicalPath, siteUrl).toString(),
        }
      : {}),
    ...(numericPrice !== null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: numericPrice,
            availability:
              product.in_stock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            ...(siteUrl
              ? {
                  url: new URL(canonicalPath, siteUrl).toString(),
                }
              : {}),
          },
        }
      : {}),
    ...(rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.toFixed(1),
            reviewCount: 1,
          },
        }
      : {}),
    ...(product.review
      ? {
          review: {
            '@type': 'Review',
            reviewBody: product.review,
            author: {
              '@type': 'Organization',
              name: 'Simdi Customer',
            },
          },
        }
      : {}),
  }

  return (
    <div className="site-page-shell">
      <Navbar />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <ProductDetailPage product={product} relatedProducts={relatedProducts} />

      <Footer />
    </div>
  )
}
