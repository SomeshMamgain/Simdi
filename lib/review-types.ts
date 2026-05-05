export type Review = {
  $id: string
  user_name?: string
  rating: number
  review?: string
  title?: string
  images?: string[]
  verifiedPurchase?: boolean
  $createdAt: string
}

export const MAX_REVIEW_IMAGE_COUNT = 4
export const MAX_REVIEW_IMAGE_SIZE_BYTES = 5 * 1024 * 1024

export type CreateReviewInput = {
  product: string
  rating: number
  review: string
  title: string
  images?: File[]
}

export type CreateReviewResponse = {
  success: boolean
  review: Review
}
