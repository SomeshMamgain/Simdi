import 'server-only'

import { Client, Databases, Query } from 'appwrite'
import { unstable_cache } from 'next/cache'

import type { ProductDocument } from '@/lib/product-types'
import { getProductIdFromSlug, getProductSlug, toSerializableProduct } from '@/lib/product-utils'

function getServerProductsConfig() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  const productsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID

  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT')
  }

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  }

  if (!databaseId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_DATABASE_ID')
  }

  if (!productsCollectionId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID')
  } 

  return {
    endpoint,
    projectId,
    databaseId,
    productsCollectionId,
  }
}

function createPublicDatabasesClient() {
  const { endpoint, projectId } = getServerProductsConfig()

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)

  return new Databases(client)
}

function toPlainProductDocument(product: ProductDocument): ProductDocument {
  return toSerializableProduct(product)
}

const getCachedProducts = unstable_cache(
  async () => {
    const { databaseId, productsCollectionId } = getServerProductsConfig()
    const databases = createPublicDatabasesClient()

    const result = await databases.listDocuments<ProductDocument>({
      databaseId,
      collectionId: productsCollectionId,
      queries: [Query.limit(100)]
    })

    return result.documents.map((product) => toPlainProductDocument(product))
  },
  ['products'],
  {
    revalidate: 300,
    tags: ['products'],
  }
)

const getCachedProductByDocumentId = unstable_cache(
  async (documentId: string) => {
    if (!documentId) {
      return null
    }

    const { databaseId, productsCollectionId } = getServerProductsConfig()
    const databases = createPublicDatabasesClient()

    try {
      const product = await databases.getDocument<ProductDocument>({
        databaseId,
        collectionId: productsCollectionId,
        documentId,
      })

      return toPlainProductDocument(product)
    } catch {
      return null
    }
  },
  ['product-by-document-id'],
  {
    revalidate: 300,
    tags: ['products'],
  }
)

export async function getProducts() {
  return getCachedProducts()
}

export async function getProductByDocumentId(documentId: string) {
  return getCachedProductByDocumentId(documentId)
}

export async function getProductBySlug(slug: string) {
  const documentId = getProductIdFromSlug(slug)

  if (documentId) {
    const productFromId = await getProductByDocumentId(documentId)

    if (productFromId) {
      return productFromId
    }
  }

  const products = await getProducts()
  const normalizedSlug = slug.toLowerCase()

  return (
    products.find((product) => getProductSlug(product).toLowerCase() === normalizedSlug) ??
    products.find((product) => product.alias_name?.toLowerCase() === normalizedSlug) ??
    products.find((product) => product.id?.toLowerCase() === normalizedSlug) ??
    null
  )
}

export async function getRelatedProducts(product: ProductDocument, limit = 4) {
  const products = await getProducts()

  const sameTypeProducts = products.filter(
    (candidate) => candidate.$id !== product.$id && candidate.type && candidate.type === product.type
  )

  if (sameTypeProducts.length >= limit) {
    return sameTypeProducts.slice(0, limit)
  }

  const sameVillageProducts = products.filter(
    (candidate) =>
      candidate.$id !== product.$id &&
      candidate.village &&
      product.village &&
      candidate.village === product.village &&
      !sameTypeProducts.some((existing) => existing.$id === candidate.$id)
  )

  const fallbackProducts = products.filter(
    (candidate) =>
      candidate.$id !== product.$id &&
      !sameTypeProducts.some((existing) => existing.$id === candidate.$id) &&
      !sameVillageProducts.some((existing) => existing.$id === candidate.$id)
  )

  return [...sameTypeProducts, ...sameVillageProducts, ...fallbackProducts].slice(0, limit)
}
