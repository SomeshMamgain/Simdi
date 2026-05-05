import 'server-only'

import { Client, Databases, ID, Query, Storage, type Models } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'
import { unstable_cache } from 'next/cache'

import { getOrdersForCustomer } from '@/lib/services/commerce-server'
import { MAX_REVIEW_IMAGE_COUNT, MAX_REVIEW_IMAGE_SIZE_BYTES, type Review } from '@/lib/review-types'

const DEFAULT_REVIEW_COLLECTION_ID = '6839b6aa00381125911b'
const DEFAULT_REVIEW_IMAGES_BUCKET_ID = '6742e69c003e3ca0399e'

interface ReviewDocument extends Models.Document {
  product?: string
  rating?: number | string
  review?: string
  title?: string
  user_name?: string
  images?: string[]
  verifiedPurchase?: boolean
}

function getReviewServiceConfig() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  const apiKey = process.env.APPWRITE_API_KEY
  const reviewsCollectionId =
    process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID ??
    process.env.APPWRITE_REVIEWS_COLLECTION_ID ??
    DEFAULT_REVIEW_COLLECTION_ID
  const reviewImagesBucketId =
    process.env.NEXT_PUBLIC_APPWRITE_REVIEW_IMAGES_BUCKET_ID ??
    process.env.APPWRITE_REVIEW_IMAGES_BUCKET_ID ??
    DEFAULT_REVIEW_IMAGES_BUCKET_ID

  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT')
  }

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  }

  if (!databaseId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID')
  }

  if (!apiKey) {
    throw new Error('Missing APPWRITE_API_KEY')
  }

  return {
    endpoint,
    projectId,
    databaseId,
    apiKey,
    reviewsCollectionId,
    reviewImagesBucketId,
  }
}

function createServerReviewDatabasesClient() {
  const { endpoint, projectId, apiKey } = getReviewServiceConfig()

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return new Databases(client)
}

function createServerReviewStorageClient() {
  const { endpoint, projectId, apiKey } = getReviewServiceConfig()

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return new Storage(client)
}

function normalizeRating(value?: number | string) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.min(5, Math.max(0, value))
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue)) {
      return Math.min(5, Math.max(0, parsedValue))
    }
  }

  return 0
}

function toSerializableReview(review: ReviewDocument): Review {
  return {
    $id: review.$id,
    user_name: typeof review.user_name === 'string' ? review.user_name : undefined,
    rating: normalizeRating(review.rating),
    review: typeof review.review === 'string' ? review.review : undefined,
    title: typeof review.title === 'string' ? review.title : undefined,
    images: Array.isArray(review.images)
      ? review.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
      : undefined,
    verifiedPurchase: review.verifiedPurchase === true,
    $createdAt: review.$createdAt,
  }
}

const getCachedReviewsByProductSlug = unstable_cache(
  async (slug: string) => {
    const normalizedSlug = slug.trim()

    if (!normalizedSlug) {
      return [] as Review[]
    }

    try {
      const { databaseId, reviewsCollectionId } = getReviewServiceConfig()
      const databases = createServerReviewDatabasesClient()

      const result = await databases.listDocuments<ReviewDocument>({
        databaseId,
        collectionId: reviewsCollectionId,
        queries: [Query.equal('product', normalizedSlug), Query.orderDesc('$createdAt'), Query.limit(10)],
      })

      return result.documents.map((review) => toSerializableReview(review))
    } catch (error) {
      console.error(`Error fetching reviews for product slug "${normalizedSlug}"`, error)
      return [] as Review[]
    }
  },
  ['reviews-by-product-slug'],
  {
    revalidate: 300,
    tags: ['reviews'],
  }
)

export async function getReviewsByProductSlug(slug: string) {
  return getCachedReviewsByProductSlug(slug)
}

function normalizeReviewText(value: string) {
  return value.trim()
}

export async function hasVerifiedPurchaseForProductSlug(viewer: {
  userId?: string
  email?: string
}, productSlug: string) {
  const normalizedProductSlug = productSlug.trim().toLowerCase()

  if (!normalizedProductSlug || (!viewer.userId && !viewer.email)) {
    return false
  }

  const orders = await getOrdersForCustomer({
    userId: viewer.userId,
    email: viewer.email,
    limit: 100,
  })

  return orders.some(
    (order) =>
      order.payment_status === 'completed' &&
      order.items.some((item) => item.slug.trim().toLowerCase() === normalizedProductSlug)
  )
}

export async function createReviewForProduct(input: {
  product: string
  rating: number
  review: string
  title: string
  userName: string
  verifiedPurchase?: boolean
  images?: string[]
}) {
  const normalizedProductSlug = input.product.trim()
  const normalizedUserName = input.userName.trim() || 'Customer'
  const normalizedImages = Array.isArray(input.images)
    ? input.images.filter((image): image is string => typeof image === 'string' && image.trim().length > 0)
    : []
  const { databaseId, reviewsCollectionId } = getReviewServiceConfig()
  const databases = createServerReviewDatabasesClient()

  const createdReview = await databases.createDocument<ReviewDocument>({
    databaseId,
    collectionId: reviewsCollectionId,
    documentId: ID.unique(),
    data: {
      product: normalizedProductSlug,
      rating: normalizeRating(input.rating),
      review: normalizeReviewText(input.review),
      title: normalizeReviewText(input.title),
      user_name: normalizedUserName,
      images: normalizedImages,
      verifiedPurchase: input.verifiedPurchase === true,
    },
  })

  return toSerializableReview(createdReview)
}

function normalizeUploadImageName(fileName: string, index: number) {
  const trimmedName = fileName.trim()

  if (!trimmedName) {
    return `review-image-${index + 1}.jpg`
  }

  return trimmedName.replace(/[^a-zA-Z0-9._-]+/g, '-')
}

export async function uploadReviewImages(files: File[]) {
  const normalizedFiles = files.filter((file) => file.size > 0)

  if (normalizedFiles.length === 0) {
    return [] as string[]
  }

  if (normalizedFiles.length > MAX_REVIEW_IMAGE_COUNT) {
    throw new Error(`Please upload no more than ${MAX_REVIEW_IMAGE_COUNT} images.`)
  }

  const { reviewImagesBucketId } = getReviewServiceConfig()
  const storage = createServerReviewStorageClient()

  const uploadedFiles = await Promise.all(
    normalizedFiles.map(async (file, index) => {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files can be attached to a review.')
      }

      if (file.size > MAX_REVIEW_IMAGE_SIZE_BYTES) {
        throw new Error(`Each image must be ${Math.round(MAX_REVIEW_IMAGE_SIZE_BYTES / (1024 * 1024))}MB or smaller.`)
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer())
      const uploadedFile = await storage.createFile({
        bucketId: reviewImagesBucketId,
        fileId: ID.unique(),
        file: InputFile.fromBuffer(fileBuffer, normalizeUploadImageName(file.name, index)),
      })

      return uploadedFile.$id
    })
  )

  return uploadedFiles
}

export async function getReviewImageFile(fileId: string) {
  const normalizedFileId = fileId.trim()

  if (!normalizedFileId) {
    throw new Error('Missing review image file ID')
  }

  const { reviewImagesBucketId } = getReviewServiceConfig()
  const storage = createServerReviewStorageClient()
  const [fileMetadata, fileData] = await Promise.all([
    storage.getFile({
      bucketId: reviewImagesBucketId,
      fileId: normalizedFileId,
    }),
    storage.getFileView({
      bucketId: reviewImagesBucketId,
      fileId: normalizedFileId,
    }),
  ])

  return {
    mimeType: fileMetadata.mimeType || 'application/octet-stream',
    data: fileData,
  }
}
