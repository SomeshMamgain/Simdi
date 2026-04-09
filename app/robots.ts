import type { MetadataRoute } from 'next'

import { getCanonicalUrl, getSiteUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cart', '/orders', '/order-confirmation/', '/reset-password'],
      },
    ],
    sitemap: getCanonicalUrl('/sitemap.xml'),
    host: getSiteUrl(),
  }
}
