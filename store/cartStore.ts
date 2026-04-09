'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { calculateCartTotals, clampCartQuantity, getCartItemCount, getCartSubtotal, getPromoDiscountAmount } from '@/lib/cart-helpers'
import type { CartItem } from '@/types/cart'
import type { OrderRecord } from '@/types/order'
import type { AppliedPromo } from '@/types/promo'

interface CartStore {
  items: CartItem[]
  appliedPromo: AppliedPromo | null
  handlingChargePercent: number
  hasHydrated: boolean
  lastCompletedOrder: OrderRecord | null
  addToCart: (item: CartItem, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyPromoCode: (promo: AppliedPromo) => void
  removePromoCode: () => void
  setHandlingCharge: (percent: number) => void
  setHydrated: (value: boolean) => void
  setLastCompletedOrder: (order: OrderRecord | null) => void
  getTotal: () => number
  getSubtotal: () => number
  getPromoDiscountAmount: () => number
  getDiscountedSubtotal: () => number
  getHandlingChargeAmount: () => number
  getItemCount: () => number
  getCartItems: () => CartItem[]
  getItemQuantity: (productId: string) => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromo: null,
      handlingChargePercent: 5,
      hasHydrated: false,
      lastCompletedOrder: null,

      addToCart: (item, quantity = 1) => {
        const normalizedQuantity = clampCartQuantity(quantity)
        const existingItem = get().items.find((currentItem) => currentItem.id === item.id)

        if (existingItem) {
          set({
            items: get().items.map((currentItem) =>
              currentItem.id === item.id
                ? {
                    ...currentItem,
                    ...item,
                    quantity: currentItem.quantity + normalizedQuantity,
                  }
                : currentItem
            ),
          })

          return
        }

        set({
          items: [...get().items, { ...item, quantity: normalizedQuantity }],
        })
      },

      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        const normalizedQuantity = clampCartQuantity(quantity)

        set({
          items: get().items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: normalizedQuantity,
                }
              : item
          ),
        })
      },

      clearCart: () => {
        set({
          items: [],
          appliedPromo: null,
          handlingChargePercent: 5,
        })
      },

      applyPromoCode: (promo) => {
        set({
          appliedPromo: promo,
        })
      },

      removePromoCode: () => {
        set({
          appliedPromo: null,
        })
      },

      setHandlingCharge: (percent) => {
        set({
          handlingChargePercent: percent === 10 ? 10 : 5,
        })
      },

      setHydrated: (value) => {
        set({
          hasHydrated: value,
        })
      },

      setLastCompletedOrder: (order) => {
        set({
          lastCompletedOrder: order,
        })
      },

      getTotal: () => calculateCartTotals(get().items, get().appliedPromo, get().handlingChargePercent).total,

      getSubtotal: () => getCartSubtotal(get().items),

      getPromoDiscountAmount: () => getPromoDiscountAmount(get().getSubtotal(), get().appliedPromo),

      getDiscountedSubtotal: () =>
        calculateCartTotals(get().items, get().appliedPromo, get().handlingChargePercent).discountedSubtotal,

      getHandlingChargeAmount: () =>
        calculateCartTotals(get().items, get().appliedPromo, get().handlingChargePercent).handlingCharge,

      getItemCount: () => getCartItemCount(get().items),

      getCartItems: () => get().items,

      getItemQuantity: (productId) => get().items.find((item) => item.id === productId)?.quantity ?? 0,
    }),
    {
      name: 'simdi-cart-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        appliedPromo: state.appliedPromo,
        handlingChargePercent: state.handlingChargePercent,
        lastCompletedOrder: state.lastCompletedOrder,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
