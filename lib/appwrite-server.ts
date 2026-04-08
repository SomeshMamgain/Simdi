// Server-only Appwrite SDK configuration. Do not import this module into client components.
import 'server-only'

import { Account, Client, Users } from 'node-appwrite'

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

if (!endpoint) {
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT')
}

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
}

if (!apiKey) {
  throw new Error('Missing APPWRITE_API_KEY')
}

const serverEndpoint = endpoint
const serverProjectId = projectId
const serverApiKey = apiKey

const appwriteServerClient = new Client()
  .setEndpoint(serverEndpoint)
  .setProject(serverProjectId)
  .setKey(serverApiKey)

export const serverAccount = new Account(appwriteServerClient)
export const users = new Users(appwriteServerClient)

export function createSessionAccount(sessionSecret: string) {
  const sessionClient = new Client()
    .setEndpoint(serverEndpoint)
    .setProject(serverProjectId)
    .setSession(sessionSecret)

  return new Account(sessionClient)
}
