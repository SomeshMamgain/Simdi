import 'server-only'

import { Account, Client, ID } from 'node-appwrite'
import { NextResponse } from 'next/server'

function getServerAuthConfig() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID

  if (!endpoint) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT')
  }

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  }

  return {
    endpoint,
    projectId,
  }
}

function getServerSessionAuthConfig() {
  const { endpoint, projectId } = getServerAuthConfig()
  const apiKey = process.env.APPWRITE_API_KEY

  if (!apiKey) {
    throw new Error('Missing APPWRITE_API_KEY')
  }

  return {
    endpoint,
    projectId,
    apiKey,
  }
}

export function createPublicAccountClient() {
  const { endpoint, projectId } = getServerAuthConfig()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)

  return new Account(client)
}

export function createServerSessionAccountClient() {
  const { endpoint, projectId, apiKey } = getServerSessionAuthConfig()
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey)

  return new Account(client)
}

export function createUserDisplayName(firstName: string, lastName: string) {
  return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ').trim()
}

export function applyAuthSessionCookies(response: NextResponse, sessionSecret: string, avatarUrl?: string | null) {
  const { projectId } = getServerAuthConfig()
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  }

  response.cookies.set({
    name: 'appwrite-session',
    value: sessionSecret,
    ...cookieOptions,
  })

  response.cookies.set({
    name: `a_session_${projectId}`,
    value: sessionSecret,
    ...cookieOptions,
  })

  if (avatarUrl) {
    response.cookies.set({
      name: 'appwrite-user-avatar',
      value: avatarUrl,
      ...cookieOptions,
    })
    return
  }

  response.cookies.set({
    name: 'appwrite-user-avatar',
    value: '',
    ...cookieOptions,
    maxAge: 0,
  })
}

export function clearAuthSessionCookies(response: NextResponse) {
  const { projectId } = getServerAuthConfig()
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  }

  response.cookies.set({
    name: 'appwrite-session',
    value: '',
    ...cookieOptions,
  })

  response.cookies.set({
    name: `a_session_${projectId}`,
    value: '',
    ...cookieOptions,
  })

  response.cookies.set({
    name: 'appwrite-user-avatar',
    value: '',
    ...cookieOptions,
  })
}

export async function createServerEmailPasswordSession(input: {
  email: string
  password: string
}) {
  // Appwrite only returns `session.secret` when the session is created through an API-key-backed server request.
  const account = createServerSessionAccountClient()

  return account.createEmailPasswordSession({
    email: input.email,
    password: input.password,
  })
}

export async function createAccountAndSession(input: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  const account = createPublicAccountClient()
  const name = createUserDisplayName(input.firstName, input.lastName)

  await account.create({
    userId: ID.unique(),
    email: input.email,
    password: input.password,
    name,
  })

  return createServerEmailPasswordSession({
    email: input.email,
    password: input.password,
  })
}
