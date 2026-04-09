import type { Metadata } from 'next'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { CartPage } from '@/components/cart/CartPage'
import { getProducts } from '@/lib/product-service'
import { toSerializableProducts } from '@/lib/product-utils'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Shopping Cart | Simdi',
  description: 'Review your selected Simdi products, apply promos, and checkout securely with Razorpay.',
  path: '/cart',
  index: false,
  follow: false,
  keywords: ['shopping cart', 'checkout', 'Simdi cart'],
})

export default async function CartRoute() {
  const suggestedProducts = await getProducts().then((products) => products.slice(0, 3)).catch(() => [])

  return (
    <div className="site-page-shell">
      <Navbar />
      <CartPage suggestions={toSerializableProducts(suggestedProducts)} />
      <Footer />
    </div>
  )
}
