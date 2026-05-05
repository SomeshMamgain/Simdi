import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

import { MAX_REVIEW_IMAGE_COUNT, MAX_REVIEW_IMAGE_SIZE_BYTES } from '@/lib/review-types'
import { createReviewForProduct, hasVerifiedPurchaseForProductSlug, uploadReviewImages } from '@/lib/review-service'
import { createReviewRequestSchema } from '@/lib/services/review-schemas'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

function getReviewerName(input: {
  profileName?: string | null
  userName?: string | null
  email?: string | null
}) {
  const profileName = input.profileName?.trim()

  if (profileName) {
    return profileName
  }

  const userName = input.userName?.trim()

  if (userName) {
    return userName
  }

  const emailPrefix = input.email?.split('@')[0]?.trim()
  return emailPrefix || 'Customer'
}

async function parseCreateReviewRequest(request: NextRequest) {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    const parsedRequest = createReviewRequestSchema.safeParse({
      product: formData.get('product'),
      rating: formData.get('rating'),
      title: formData.get('title'),
      review: formData.get('review'),
    })

    if (!parsedRequest.success) {
      return {
        success: false as const,
        message: 'Please complete the review form before submitting',
      }
    }

    const images = formData.getAll('images').filter((entry): entry is File => entry instanceof File && entry.size > 0)

    if (images.length > MAX_REVIEW_IMAGE_COUNT) {
      return {
        success: false as const,
        message: `Please upload no more than ${MAX_REVIEW_IMAGE_COUNT} images.`,
      }
    }

    const oversizedFile = images.find((image) => image.size > MAX_REVIEW_IMAGE_SIZE_BYTES)

    if (oversizedFile) {
      return {
        success: false as const,
        message: `Each image must be ${Math.round(MAX_REVIEW_IMAGE_SIZE_BYTES / (1024 * 1024))}MB or smaller.`,
      }
    }

    const nonImageFile = images.find((image) => !image.type.startsWith('image/'))

    if (nonImageFile) {
      return {
        success: false as const,
        message: 'Only image files can be attached to a review.',
      }
    }

    return {
      success: true as const,
      data: parsedRequest.data,
      images,
    }
  }

  const body = await request.json()
  const parsedRequest = createReviewRequestSchema.safeParse(body)

  if (!parsedRequest.success) {
    return {
      success: false as const,
      message: 'Please complete the review form before submitting',
    }
  }

  return {
    success: true as const,
    data: parsedRequest.data,
    images: [] as File[],
  }
}

export async function POST(request: NextRequest) {
  const sessionSecret = request.cookies.get('appwrite-session')?.value

  if (!sessionSecret) {
    return NextResponse.json({ message: 'Please sign in to write a review' }, { status: 401 })
  }

  try {
    const authPayload = await getAuthSessionPayload(sessionSecret)

    if (!authPayload.isLoggedIn || !authPayload.user) {
      return NextResponse.json({ message: 'Please sign in to write a review' }, { status: 401 })
    }

    const parsedRequest = await parseCreateReviewRequest(request)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: parsedRequest.message }, { status: 400 })
    }

    const verifiedPurchase = await hasVerifiedPurchaseForProductSlug(
      {
        userId: authPayload.user.id,
        email: authPayload.user.email,
      },
      parsedRequest.data.product
    )
    const imageIds = await uploadReviewImages(parsedRequest.images)

    const review = await createReviewForProduct({
      ...parsedRequest.data,
      userName: getReviewerName({
        profileName: authPayload.profile?.name,
        userName: authPayload.user.name,
        email: authPayload.user.email,
      }),
      verifiedPurchase,
      images: imageIds,
    })

    revalidateTag('reviews', 'max')
    revalidatePath(`/products/${parsedRequest.data.product}`, 'page')

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Creating product review failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to submit your review right now',
      },
      { status: 500 }
    )
  }
}
