export interface CartItem {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  image: string
  inStock: boolean
  stock?: number | null
  unit?: string
  variant?: string
}
