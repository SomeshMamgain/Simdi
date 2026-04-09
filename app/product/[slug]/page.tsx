import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'

type ProductDetailRouteProps = {
  params: Promise<{ slug: string }>
}

export const metadata: Metadata = buildMetadata({
  title: 'Product Redirect | Simdi',
  description: 'Legacy product route redirecting to the current Simdi product detail page.',
  path: '/product',
  index: false,
  follow: false,
  keywords: ['product redirect', 'legacy product page'],
})

export default async function LegacyProductDetailRedirect({ params }: ProductDetailRouteProps) {
  const { slug } = await params
  permanentRedirect(`/products/${slug}`)
}
