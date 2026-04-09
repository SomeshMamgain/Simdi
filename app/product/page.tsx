import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Products Redirect | Simdi',
  description: 'Legacy products route redirecting to the current Simdi products page.',
  path: '/product',
  index: false,
  follow: false,
  keywords: ['products redirect', 'legacy products route'],
})

export default function LegacyProductsRedirect() {
  permanentRedirect('/products')
}
