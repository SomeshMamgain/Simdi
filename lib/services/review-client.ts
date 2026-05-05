import type { CreateReviewInput, CreateReviewResponse } from '@/lib/review-types'

export async function submitProductReview(input: CreateReviewInput) {
  const formData = new FormData()
  formData.set('product', input.product)
  formData.set('rating', String(input.rating))
  formData.set('title', input.title)
  formData.set('review', input.review)

  for (const image of input.images ?? []) {
    formData.append('images', image)
  }

  const response = await fetch('/api/reviews', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  const payload = await response.json().catch(() => null) as CreateReviewResponse | { message?: string } | null

  if (!response.ok) {
    throw new Error((payload && 'message' in payload ? payload.message : undefined) ?? 'Unable to submit your review')
  }

  return payload as CreateReviewResponse
}
