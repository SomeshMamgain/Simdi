'use client'

import type { CSSProperties } from 'react'

import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'

import { trackEvent } from '@/lib/analytics/gtag'
import { buildCartItem } from '@/lib/cart-helpers'
import type { ProductDocument } from '@/lib/product-types'
import type { ProductSizeOption } from '@/lib/product-utils'
import { useCartStore } from '@/store/cartStore'

interface AddToCartButtonProps {
  product: ProductDocument
  quantity?: number
  size?: ProductSizeOption | null
  label?: string
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

export function AddToCartButton({
  product,
  quantity = 1,
  size,
  label = 'Add to Cart',
  disabled = false,
  className,
  style,
}: AddToCartButtonProps) {
  const addToCart = useCartStore((state) => state.addToCart)
  const inStock = product.in_stock !== false && !disabled

  const handleAddToCart = () => {
    const item = buildCartItem(product, { size })

    addToCart(item, quantity)
    void trackEvent(
      'add_to_cart',
      {
        category: 'CTA',
        priority: 'primary',
        page: '/products/[slug]',
        product_id: item.productId,
        product_name: item.name,
        product_slug: item.slug,
        price: item.price,
        quantity,
        currency: 'INR',
        variant: item.variant,
      },
      {
        debounceKey: `add_to_cart:${item.id}`,
      }
    )
    toast.success(
      quantity > 1
        ? `${quantity} × ${item.name} added to your cart`
        : `${item.name} added to your cart`
    )
  }

  return (
    <button
      type="button"
      className={className}
      style={style}
      disabled={!inStock}
      onClick={handleAddToCart}
    >
      <ShoppingBag size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
      {inStock ? label : 'Out of Stock'}
    </button>
  )
}
