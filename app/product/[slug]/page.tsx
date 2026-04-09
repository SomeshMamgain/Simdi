import { permanentRedirect } from 'next/navigation'

type ProductDetailRouteProps = {
  params: Promise<{ slug: string }>
}

export default async function LegacyProductDetailRedirect({ params }: ProductDetailRouteProps) {
  const { slug } = await params
  permanentRedirect(`/products/${slug}`)
}
