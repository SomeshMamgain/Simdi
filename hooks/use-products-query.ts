'use client'

import { useQuery } from '@tanstack/react-query'
import type { Models } from 'appwrite'

import { appwriteConfig, databases } from '@/lib/appwrite'

export interface ProductDocument extends Models.Document {
  id?: string
  name?: string
  price?: string
  image?: string
  alias_name?: string
  description?: string
  history?: string
  calories?: number
  fat?: number
  carbs?: number
  protein?: number
  storage?: string
  preparation?: string
  review?: string
  unit?: string
  nutrition_fact?: string
  seasonal?: boolean
  type?: string
  in_stock?: boolean
  rating?: number
  image_list_comma_separated_link?: string
  key_higlights_comma_separated?: string
  ingredients?: string
  shelf_life?: string
  texture?: string
  taste_note?: string
  method?: string
  village?: string
  keywords?: string
  video?: string
}

async function getProducts() {
  const result = await databases.listDocuments<ProductDocument>({
    databaseId: appwriteConfig.databaseId,
    collectionId: appwriteConfig.productsCollectionId,
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
