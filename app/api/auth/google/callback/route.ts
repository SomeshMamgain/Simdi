// Server-only route handler for finishing Google OAuth and creating an Appwrite session.
import { ID, Query } from 'node-appwrite'
import { NextRequest, NextResponse } from 'next/server'

import { users } from '@/lib/appwrite-server'

interface GoogleTokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface GoogleUserInfoResponse {
  id?: string
  email?: string
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
}

function getAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

  if (!clientId) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  if (!clientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_SECRET')
  }

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID')
  }

  return {
    clientId,
    clientSecret,
    projectId,
    configuredBaseUrl,
  }
}

function buildFailureRedirect(baseUrl: string) {
  return new URL('/login?error=auth_failed', baseUrl)
}

export async function GET(request: NextRequest) {
  const { clientId, clientSecret, projectId, configuredBaseUrl } = getAuthConfig()
  const baseUrl = configuredBaseUrl?.replace(/\/$/, '') || request.nextUrl.origin
  const failureRedirect = buildFailureRedirect(baseUrl)

  try {
    const code = request.nextUrl.searchParams.get('code')

    if (!code) {
      throw new Error('Missing Google OAuth code')
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
      cache: 'no-store',
    })

    const tokenData = await tokenResponse.json() as GoogleTokenResponse

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange Google auth code')
    }

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: 'no-store',
    })

    const userInfo = await userInfoResponse.json() as GoogleUserInfoResponse

    if (!userInfoResponse.ok || !userInfo.email) {
      throw new Error('Failed to fetch Google user profile')
    }

    const fallbackName =
      userInfo.name ??
      ([userInfo.given_name, userInfo.family_name].filter(Boolean).join(' ').trim() || userInfo.email)

    const existingUsers = await users.list({
      queries: [Query.equal('email', userInfo.email)],
    })

    const appwriteUser = existingUsers.users[0] ?? await users.create({
      userId: ID.unique(),
      email: userInfo.email,
      name: fallbackName,
    })

    const session = await users.createSession({
      userId: appwriteUser.$id,
    })

    if (!session.secret) {
      throw new Error('Appwrite session secret was not returned')
    }
    const state = request.nextUrl.searchParams.get('state')
const redirectPath = state ? `/${state}` : '/'

const response = NextResponse.redirect(new URL(redirectPath, baseUrl))
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    }

    response.cookies.set({
      name: 'appwrite-session',
      value: session.secret,
      ...cookieOptions,
    })

    response.cookies.set({
      name: `a_session_${projectId}`,
      value: session.secret,
      ...cookieOptions,
    })

    if (userInfo.picture) {
      response.cookies.set({
        name: 'appwrite-user-avatar',
        value: userInfo.picture,
        ...cookieOptions,
      })
    } else {
      response.cookies.set({
        name: 'appwrite-user-avatar',
        value: '',
        ...cookieOptions,
        maxAge: 0,
      })
    }

    return response
  } catch (error) {
    console.error('Google OAuth callback failed:', error)
    return NextResponse.redirect(failureRedirect)
  }
}
