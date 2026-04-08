import { Client, Databases } from 'appwrite'

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

export const appwriteClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)

export const databases = new Databases(appwriteClient)

export const appwriteConfig = {
  databaseId,
  productsCollectionId,
}
