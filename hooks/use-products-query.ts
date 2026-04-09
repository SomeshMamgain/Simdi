'use client'

import { useQuery } from '@tanstack/react-query'

import { databases, getProductsConfig } from '@/lib/appwrite'
import type { ProductDocument } from '@/lib/product-types'

async function getProducts() {
  const { databaseId, productsCollectionId } = getProductsConfig()

  const result = await databases.listDocuments<ProductDocument>({
    databaseId,
    collectionId: productsCollectionId,
    queries: [],
  })

  return result.documents
}

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}
