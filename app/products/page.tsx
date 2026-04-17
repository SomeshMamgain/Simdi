import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ProductsCatalog } from '@/components/products/ProductsCatalog'
import { buildMetadata } from '@/lib/seo'
import { getProducts } from '@/lib/product-service'
import type { ProductDocument } from '@/lib/product-types'
import { toSerializableProducts } from '@/lib/product-utils'

export const revalidate = 300

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Products | Simdi',
    description:
      'Browse Simdi products sourced from Uttarakhand, including Himalayan staples, seasonal harvests, and mountain-made pantry essentials.',
    path: '/products',
    keywords: [
      'buy Himalayan products online',
      'buy Pahadi products',
      'organic products from Uttarakhand',
      'Bilona ghee online',
      'wild honey online India',
      'traditional Himalayan pantry',
    ],
    images: ['/products.jpg'],
    imageAlt: 'SIMDI products collection page',
  })
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
            <ProductsCatalog products={serializableProducts} />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
