import type { ProductDocument } from '@/lib/product-types'
import type { ProductSizeOption } from '@/lib/product-utils'
import { getPrimaryImage, getProductSlug, getVariantPrice, toNumber } from '@/lib/product-utils'
import type { CartItem } from '@/types/cart'
import type { AppliedPromo } from '@/types/promo'

export interface CartTotals {
  subtotal: number
  promoDiscount: number
  discountedSubtotal: number
  handlingCharge: number
  total: number
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100
}

export function clampCartQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1
  }

  return Math.max(1, Math.floor(quantity))
}

export function getCartSubtotal(items: CartItem[]) {
  return roundCurrency(
    items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
  )
}

export function getCartItemCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getPromoDiscountAmount(subtotal: number, promo: AppliedPromo | null | undefined) {
  if (!promo || subtotal <= 0) {
    return 0
  }

  if (promo.minimumPurchase && subtotal < promo.minimumPurchase) {
    return 0
  }

  const fixedDiscount = promo.discountAmount > 0 ? promo.discountAmount : subtotal * (promo.discountPercent / 100)

  return roundCurrency(Math.min(subtotal, Math.max(0, fixedDiscount)))
}

export function calculateCartTotals(
  items: CartItem[],
  promo: AppliedPromo | null | undefined,
  handlingChargePercent: number
): CartTotals {
  const subtotal = getCartSubtotal(items)
  const promoDiscount = getPromoDiscountAmount(subtotal, promo)
  const discountedSubtotal = roundCurrency(Math.max(0, subtotal - promoDiscount))
  const normalizedHandlingPercent = handlingChargePercent === 10 ? 10 : 5
  const handlingCharge = roundCurrency(discountedSubtotal * (normalizedHandlingPercent / 100))

  return {
    subtotal,
    promoDiscount,
    discountedSubtotal,
    handlingCharge,
    total: roundCurrency(discountedSubtotal + handlingCharge),
  }
}

export function resolveProductStock(product: Pick<ProductDocument, 'stock' | 'in_stock'>) {
  const stock = toNumber(product.stock)

  if (stock === null) {
    return product.in_stock === false ? 0 : null
  }

  return Math.max(0, Math.floor(stock))
}

export function buildCartItem(
  product: ProductDocument,
  options?: {
    size?: ProductSizeOption | null
  }
): CartItem {
  const size = options?.size ?? null
  const rawPrice = size
    ? getVariantPrice(product.price, size.multiplier, size.surcharge)
    : product.price
  const price = toNumber(rawPrice) ?? 0
  const variant = size?.label?.trim() || undefined
  const baseName = product.name ?? 'Untitled product'

  return {
    id: size ? `${product.$id}:${size.value}` : product.$id,
    productId: product.$id,
    slug: getProductSlug(product),
    name: variant ? `${baseName} (${variant})` : baseName,
    price,
    quantity: 1,
    image: getPrimaryImage(product),
    inStock: product.in_stock !== false,
    stock: resolveProductStock(product),
    unit: variant ?? product.unit,
    variant,
  }
}
