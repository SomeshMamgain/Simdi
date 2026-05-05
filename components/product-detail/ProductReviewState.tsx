'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import type { Review } from '@/lib/review-types'

type ProductReviewStateValue = {
  reviews: Review[]
  averageRating: number
  reviewCount: number
  applyReview: (review: Review) => void
}

const ProductReviewStateContext = createContext<ProductReviewStateValue | null>(null)

function calculateReviewSummary(reviews: Review[]) {
  const reviewCount = reviews.length
  const averageRating = reviewCount
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviewCount
    : 0

  return {
    averageRating,
    reviewCount,
  }
}

export function ProductReviewStateProvider({
  initialReviews,
  children,
}: {
  initialReviews: Review[]
  children: ReactNode
}) {
  const [reviews, setReviews] = useState(initialReviews)

  useEffect(() => {
    setReviews(initialReviews)
  }, [initialReviews])

  const summary = calculateReviewSummary(reviews)

  const applyReview = (review: Review) => {
    setReviews((currentReviews) => [review, ...currentReviews.filter((existingReview) => existingReview.$id !== review.$id)])
  }

  return (
    <ProductReviewStateContext.Provider
      value={{
        reviews,
        averageRating: summary.averageRating,
        reviewCount: summary.reviewCount,
        applyReview,
      }}
    >
      {children}
    </ProductReviewStateContext.Provider>
  )
}

export function useProductReviewState() {
  const reviewState = useContext(ProductReviewStateContext)

  if (!reviewState) {
    throw new Error('useProductReviewState must be used within ProductReviewStateProvider')
  }

  return reviewState
}
