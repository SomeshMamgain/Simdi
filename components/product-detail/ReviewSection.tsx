'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { BadgeCheck, MessageCircleMore, Star, X } from 'lucide-react'

import { AuthModal } from '@/components/AuthModal'
import { submitProductReview } from '@/lib/services/review-client'
import { MAX_REVIEW_IMAGE_COUNT, MAX_REVIEW_IMAGE_SIZE_BYTES, type Review } from '@/lib/review-types'
import { useAuthStore } from '@/store/authStore'

import styles from './ProductDetailPage.module.css'
import { useProductReviewState } from './ProductReviewState'

interface ReviewSectionProps {
  productSlug: string
  productName?: string
}

type ReviewFormState = {
  rating: number
  title: string
  review: string
}

type ReviewFormStatus = {
  type: 'error' | 'success'
  message: string
} | null

type SelectedReviewImage = {
  id: string
  file: File
  previewUrl: string
}

const initialReviewFormState: ReviewFormState = {
  rating: 5,
  title: '',
  review: '',
}

const reviewDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function formatReviewDate(dateValue: string) {
  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.valueOf())) {
    return ''
  }

  return reviewDateFormatter.format(parsedDate)
}

function getReviewImages(review: Review) {
  return Array.isArray(review.images)
    ? review.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
    : []
}

function getReviewImageSrc(image: string) {
  return `/api/reviews/images/${encodeURIComponent(image)}`
}

function formatReviewImageLimit() {
  return `${Math.round(MAX_REVIEW_IMAGE_SIZE_BYTES / (1024 * 1024))}MB`
}

function createSelectedReviewImage(file: File, index: number): SelectedReviewImage {
  return {
    id: `${file.name}-${file.lastModified}-${index}-${Math.random().toString(36).slice(2, 8)}`,
    file,
    previewUrl: URL.createObjectURL(file),
  }
}

export function ReviewSection({ productSlug, productName }: ReviewSectionProps) {
  const router = useRouter()
  const { reviews, averageRating, reviewCount, applyReview } = useProductReviewState()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const currentUser = useAuthStore((state) => state.currentUser)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession)
  const checkSession = useAuthStore((state) => state.checkSession)
  const reviewImageInputRef = useRef<HTMLInputElement | null>(null)
  const selectedImagesRef = useRef<SelectedReviewImage[]>([])

  const [reviewForm, setReviewForm] = useState<ReviewFormState>(initialReviewFormState)
  const [selectedImages, setSelectedImages] = useState<SelectedReviewImage[]>([])
  const [formStatus, setFormStatus] = useState<ReviewFormStatus>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    selectedImagesRef.current = selectedImages
  }, [selectedImages])

  useEffect(() => {
    return () => {
      for (const image of selectedImagesRef.current) {
        URL.revokeObjectURL(image.previewUrl)
      }
    }
  }, [])

  const verifiedReviewCount = reviews.filter((review) => review.verifiedPurchase).length
  const sessionReady = hasHydrated || hasCheckedSession
  const identityLabel = currentUser?.name?.trim() || currentUser?.email || 'your account'

  const renderStars = (rating: number, label: string) => (
    <div className={styles.reviewStars} aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={16}
          fill={index < Math.round(rating) ? '#D0A869' : 'transparent'}
          color={index < Math.round(rating) ? '#D0A869' : '#C8B28B'}
        />
      ))}
    </div>
  )

  const ensureSignedIn = async () => {
    if (isLoggedIn) {
      return true
    }

    setIsCheckingAccess(true)

    try {
      const session = await checkSession()

      if (session.isLoggedIn) {
        return true
      }

      setIsAuthModalOpen(true)
      return false
    } finally {
      setIsCheckingAccess(false)
    }
  }

  const handleRatingSelect = (rating: number) => {
    setReviewForm((currentForm) => ({ ...currentForm, rating }))
    setFormStatus(null)
  }

  const handleFieldChange = (field: 'title' | 'review', value: string) => {
    setReviewForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFormStatus(null)
  }

  const clearSelectedImages = () => {
    setSelectedImages((currentImages) => {
      for (const image of currentImages) {
        URL.revokeObjectURL(image.previewUrl)
      }

      return []
    })

    if (reviewImageInputRef.current) {
      reviewImageInputRef.current.value = ''
    }
  }

  const removeSelectedImage = (imageId: string) => {
    setSelectedImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === imageId)

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl)
      }

      return currentImages.filter((image) => image.id !== imageId)
    })

    setFormStatus(null)
  }

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? [])

    if (incomingFiles.length === 0) {
      return
    }

    setFormStatus(null)

    const remainingSlots = MAX_REVIEW_IMAGE_COUNT - selectedImagesRef.current.length

    if (remainingSlots <= 0) {
      setFormStatus({
        type: 'error',
        message: `You can upload up to ${MAX_REVIEW_IMAGE_COUNT} review images.`,
      })
      event.target.value = ''
      return
    }

    const filesToAdd = incomingFiles.slice(0, remainingSlots)

    for (const file of filesToAdd) {
      if (!file.type.startsWith('image/')) {
        setFormStatus({
          type: 'error',
          message: 'Only image files can be attached to a review.',
        })
        event.target.value = ''
        return
      }

      if (file.size > MAX_REVIEW_IMAGE_SIZE_BYTES) {
        setFormStatus({
          type: 'error',
          message: `Each image must be ${formatReviewImageLimit()} or smaller.`,
        })
        event.target.value = ''
        return
      }
    }

    const nextImages = filesToAdd.map((file, index) => createSelectedReviewImage(file, index))

    setSelectedImages((currentImages) => [...currentImages, ...nextImages])

    if (incomingFiles.length > filesToAdd.length) {
      setFormStatus({
        type: 'error',
        message: `Only the first ${MAX_REVIEW_IMAGE_COUNT} images were kept.`,
      })
    }

    event.target.value = ''
  }

  const handleLoginPrompt = async () => {
    setFormStatus(null)
    await ensureSignedIn()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus(null)

    const isAuthenticated = await ensureSignedIn()

    if (!isAuthenticated) {
      return
    }

    const normalizedTitle = reviewForm.title.trim()
    const normalizedReviewBody = reviewForm.review.trim()

    if (normalizedTitle.length < 3) {
      setFormStatus({ type: 'error', message: 'Add a short title so your review is easier to scan.' })
      return
    }

    if (normalizedReviewBody.length < 10) {
      setFormStatus({ type: 'error', message: 'Write at least a sentence about your experience.' })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await submitProductReview({
        product: productSlug,
        rating: reviewForm.rating,
        title: normalizedTitle,
        review: normalizedReviewBody,
        images: selectedImages.map((image) => image.file),
      })

      applyReview(response.review)
      setReviewForm(initialReviewFormState)
      clearSelectedImages()
      setFormStatus({
        type: 'success',
        message: 'Your review is live. Thanks for helping other customers shop with confidence.',
      })

      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit your review right now.'

      if (/sign in/i.test(message)) {
        setIsAuthModalOpen(true)
      }

      setFormStatus({
        type: 'error',
        message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.reviewStack}>
      {reviewCount > 0 ? (
        <div className={styles.reviewSummary}>
          <div className={styles.reviewSummaryHero}>
            <span className={styles.reviewSummaryValue}>{averageRating.toFixed(1)}</span>
            <div>
              {renderStars(averageRating, `${averageRating.toFixed(1)} out of 5 stars`)}
              <p className={styles.reviewSummaryText}>
                Based on {reviewCount} customer review{reviewCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className={styles.reviewSummaryMeta}>
            <div className={styles.reviewStat}>
              <span className={styles.reviewStatValue}>{reviewCount}</span>
              <span className={styles.reviewStatLabel}>Total reviews</span>
            </div>

            <div className={styles.reviewStat}>
              <span className={styles.reviewStatValue}>{verifiedReviewCount}</span>
              <span className={styles.reviewStatLabel}>Verified purchases</span>
            </div>
          </div>
        </div>
      ) : null}

      {isLoggedIn ? (
        <section className={styles.reviewComposer}>
          <div className={styles.reviewComposerHeader}>
            <div>
              <h3 className={styles.reviewComposerTitle}>Write a review</h3>
              <p className={styles.reviewComposerText}>
                Share how {productName ?? 'this product'} looked, tasted, or fit into your kitchen routine.
              </p>
            </div>
            <span className={styles.reviewComposerIdentity}>Posting as {identityLabel}</span>
          </div>

          <form className={styles.reviewForm} onSubmit={handleSubmit}>
            <div className={styles.reviewFieldGroup}>
              <span className={styles.reviewFieldLabel}>Your rating</span>
              <div className={styles.reviewRatingPicker}>
                {Array.from({ length: 5 }, (_, index) => {
                  const ratingValue = index + 1
                  const isActive = ratingValue <= reviewForm.rating

                  return (
                    <button
                      key={ratingValue}
                      type="button"
                      className={`${styles.reviewRatingButton} ${isActive ? styles.reviewRatingButtonActive : ''}`}
                      onClick={() => handleRatingSelect(ratingValue)}
                      aria-label={`Rate ${ratingValue} out of 5`}
                    >
                      <Star size={18} fill={isActive ? '#D0A869' : 'transparent'} color={isActive ? '#D0A869' : '#C8B28B'} />
                    </button>
                  )
                })}
                <span className={styles.reviewRatingHint}>{reviewForm.rating.toFixed(1)} / 5</span>
              </div>
            </div>

            <div className={styles.reviewFieldGrid}>
              <label className={styles.reviewField}>
                <span>Review title</span>
                <input
                  className={styles.reviewInput}
                  type="text"
                  value={reviewForm.title}
                  onChange={(event) => handleFieldChange('title', event.target.value)}
                  placeholder="Pure taste, lovely texture"
                  maxLength={120}
                />
              </label>
            </div>

            <label className={styles.reviewField}>
              <span>Your review</span>
              <textarea
                className={`${styles.reviewInput} ${styles.reviewTextarea}`}
                value={reviewForm.review}
                onChange={(event) => handleFieldChange('review', event.target.value)}
                placeholder="Tell other shoppers what stood out for you."
                rows={5}
                maxLength={2000}
              />
            </label>

            <div className={styles.reviewField}>
              <span>Add photos</span>
              <input
                ref={reviewImageInputRef}
                className={styles.reviewFileInput}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelection}
              />
              <p className={styles.reviewUploadHint}>
                Upload up to {MAX_REVIEW_IMAGE_COUNT} images. Each image should be {formatReviewImageLimit()} or smaller.
              </p>

              {selectedImages.length > 0 ? (
                <div className={styles.reviewSelectedGrid}>
                  {selectedImages.map((image, index) => (
                    <div key={image.id} className={styles.reviewSelectedCard}>
                      <img
                        className={styles.reviewSelectedPreview}
                        src={image.previewUrl}
                        alt={`Selected review image ${index + 1}`}
                      />
                      <button
                        type="button"
                        className={styles.reviewSelectedRemove}
                        onClick={() => removeSelectedImage(image.id)}
                        aria-label={`Remove selected review image ${index + 1}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {formStatus ? <div className={`auth-status auth-status--${formStatus.type}`}>{formStatus.message}</div> : null}

            <div className={styles.reviewComposerActions}>
              <button className={styles.reviewSubmitButton} type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting review...' : 'Submit review'}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className={styles.reviewGate}>
          <div>
            <h3 className={styles.reviewComposerTitle}>Write a review</h3>
            <p className={styles.reviewComposerText}>
              {sessionReady
                ? 'Login to write a review and help other customers choose with confidence.'
                : 'Checking your account so we can unlock review writing.'}
            </p>
          </div>

          <button
            className={styles.reviewLoginButton}
            type="button"
            onClick={() => {
              void handleLoginPrompt()
            }}
            disabled={isCheckingAccess}
          >
            {isCheckingAccess ? 'Checking account...' : 'Login to write a review'}
          </button>
        </section>
      )}

      {reviewCount > 0 ? (
        <div className={styles.reviewList}>
          {reviews.map((review) => {
            const reviewImages = getReviewImages(review)
            const formattedDate = formatReviewDate(review.$createdAt)

            return (
              <article key={review.$id} className={styles.reviewCard}>
                <div className={styles.reviewCardTop}>
                  <div className={styles.reviewAuthorBlock}>
                    <div className={styles.reviewAuthorRow}>
                      <span className={styles.reviewAuthorName}>{review.user_name || 'Customer'}</span>
                      {review.verifiedPurchase ? (
                        <span className={styles.reviewVerifiedBadge}>
                          <BadgeCheck size={14} />
                          Verified purchase
                        </span>
                      ) : null}
                    </div>

                    {formattedDate ? (
                      <time className={styles.reviewDate} dateTime={review.$createdAt}>
                        {formattedDate}
                      </time>
                    ) : null}
                  </div>

                  <div className={styles.reviewRatingRow}>
                    {renderStars(review.rating, `${review.rating} out of 5 stars`)}
                    <span className={styles.reviewRatingValue}>{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                {review.title ? <h3 className={styles.reviewTitle}>{review.title}</h3> : null}
                {review.review ? <p className={styles.reviewBody}>{review.review}</p> : null}

                {reviewImages.length > 0 ? (
                  <div className={styles.reviewImageGrid}>
                    {reviewImages.map((image, index) => (
                      <img
                        key={`${review.$id}-${index}`}
                        className={styles.reviewImage}
                        src={getReviewImageSrc(image)}
                        alt={review.title ? `${review.title} review image ${index + 1}` : `Customer review image ${index + 1}`}
                        loading="lazy"
                        onError={() => {
                          console.error(`Failed to load review image ${image} for review ${review.$id}`)
                        }}
                      />
                    ))}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      ) : (
        <div className={styles.quote}>
          <span className={styles.quoteBody}>
            <MessageCircleMore size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
            Be the first to review {productName ?? 'this product'} and help other shoppers buy with confidence.
          </span>
        </div>
      )}

      <AuthModal
        open={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setFormStatus({
            type: 'success',
            message: 'You are signed in now. Your review form is ready.',
          })
        }}
      />
    </div>
  )
}
