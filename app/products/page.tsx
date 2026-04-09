import type { Metadata } from 'next'
import { Suspense } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { getProducts } from '@/lib/product-service'
import type { ProductDocument } from '@/lib/product-types'
import { toSerializableProducts } from '@/lib/product-utils'

export const revalidate = 300

export function generateMetadata(): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const canonicalPath = '/products'
  const title = 'Products | Simdi'
  const description =
    'Browse Simdi products sourced from Uttarakhand, including Himalayan staples, seasonal harvests, and mountain-made pantry essentials.'

  return {
    title,
    description,
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProductsPage() {
  let products: ProductDocument[] = []
  let hasError = false

  try {
    products = await getProducts()
  } catch (error) {
    console.error('Error fetching products from Appwrite collection', error)
    hasError = true
  }

  const serializableProducts = toSerializableProducts(products)

  return (
    <div className="site-page-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <section style={{ padding: '72px 20px 36px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p
            style={{
              color: '#B58E58',
              letterSpacing: '0.22em',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '14px',
            }}
          >
            FROM OUR APPWRITE COLLECTION
          </p>
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
              color: '#1E2D24',
              margin: 0,
            }}
          >
            Products
          </h1>
          <p
            style={{
              color: '#5E6E5E',
              fontSize: '1rem',
              lineHeight: 1.8,
              maxWidth: '700px',
              marginTop: '18px',
            }}
          >
            Browse the live products coming from your Appwrite products collection. Each card links to a dedicated
            detail page with richer product information, media, and purchase context.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 20px 100px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {hasError ? (
            <div
              style={{
                background: '#fff7f5',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center',
                color: '#9F3A20',
                border: '1px solid #F0C5B7',
              }}
            >
              Unable to load products right now. Please check your Appwrite permissions and collection settings.
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center',
                color: '#5E6E5E',
                border: '1px solid #E7E0D4',
              }}
            >
              No products were found in the collection yet.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '28px',
                  flexWrap: 'wrap',
                }}
              >
                <p style={{ margin: 0, color: '#5E6E5E', fontSize: '0.95rem' }}>Showing {products.length} live products</p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                }}
              >
                {serializableProducts.map((product) => (
                  <ProductCard key={product.$id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
