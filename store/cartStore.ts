import { create } from 'zustand'

type CartItemId = string | number

export interface CartItem {
  id: CartItemId
  name: string
  price: string
  img: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: CartItemId) => void
  clearCart: () => void
  totalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item, quantity = 1) => {
    const existing = get().items.find((i) => i.id === item.id)
    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        ),
      })
    } else {
      set({ items: [...get().items, { ...item, quantity }] })
    }
  },

  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) })
  },

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
