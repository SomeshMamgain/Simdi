import type { MetadataRoute } from 'next'

import { getProducts } from '@/lib/product-service'
import { getProductSlug } from '@/lib/product-utils'
import { getCanonicalUrl } from '@/lib/seo'

const staticPages: MetadataRoute.Sitemap = [
  {
    url: getCanonicalUrl('/'),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  },
  {
    url: getCanonicalUrl('/products'),
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: getCanonicalUrl('/our-roots'),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: getCanonicalUrl('/blogs'),
    lastModified: new Date('2026-04-03T00:00:00.000Z'),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: getCanonicalUrl('/blogs/pahadi-superfoods'),
    lastModified: new Date('2026-04-03T00:00:00.000Z'),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: getCanonicalUrl('/contact'),
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: getCanonicalUrl('/privacy'),
    lastModified: new Date('2026-04-04T00:00:00.000Z'),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const products = await getProducts()

    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
      url: getCanonicalUrl(`/products/${getProductSlug(product)}`),
      lastModified: product.$updatedAt ? new Date(product.$updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error('Unable to generate product entries for sitemap:', error)
    return staticPages
  }
}
