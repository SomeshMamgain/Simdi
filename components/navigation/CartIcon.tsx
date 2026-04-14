'use client'

import { ShoppingBag } from 'lucide-react'

import { TrackedLink } from '@/components/analytics/TrackedLink'
import { useCartStore } from '@/store/cartStore'

export function CartIcon() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <TrackedLink
      href="/cart"
      className="icon-btn"
      style={{ position: 'relative', color:"#ffffff" }}
      aria-label={`Cart with ${itemCount} items`}
      eventName="cart_icon_click"
      eventParams={{
        category: 'CTA',
        priority: 'primary',
        page: 'global',
        cart_items_count: itemCount,
      }}
    >
      <ShoppingBag size={22} />
      {itemCount > 0 ? <span className="cart-badge">{itemCount}</span> : null}
    </TrackedLink>
  )
}
