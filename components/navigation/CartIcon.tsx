'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

import { useCartStore } from '@/store/cartStore'

export function CartIcon() {
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <Link href="/cart" className="icon-btn" style={{ position: 'relative' }} aria-label={`Cart with ${itemCount} items`}>
      <ShoppingBag size={22} />
      {itemCount > 0 ? <span className="cart-badge">{itemCount}</span> : null}
    </Link>
  )
}
