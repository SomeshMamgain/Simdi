export interface PromoCode {
  $id?: string
  code: string
  discountPercent: number
  discountAmount: number
  expiryDate?: string | null
  minimumPurchase?: number | null
  maxUses?: number | null
  currentUses?: number | null
  usedByUser?: boolean
  isActive?: boolean
  message?: string
}

export interface AppliedPromo {
  code: string
  discountPercent: number
  discountAmount: number
  minimumPurchase?: number | null
  message?: string
}

export interface PromoValidationResult {
  valid: boolean
  code?: string
  discountPercent: number
  discountAmount: number
  minimumPurchase?: number | null
  message: string
}
