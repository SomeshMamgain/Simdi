// Server-only route handler that clears the backend-managed Appwrite session cookie and current session.
import { NextRequest, NextResponse } from 'next/server'

import { createSessionAccount } from '@/lib/appwrite-server'

export async function POST(request: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  const sessionSecret = request.cookies.get('appwrite-session')?.value
  const response = NextResponse.json({ success: true })

  if (sessionSecret) {
    try {
      const account = createSessionAccount(sessionSecret)
      await account.deleteSession('current')
    } catch (error) {
      console.error('Backend logout failed:', error)
    }
  }

  response.cookies.set({
    name: 'appwrite-session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  if (projectId) {
    response.cookies.set({
      name: `a_session_${projectId}`,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  response.cookies.set({
    name: 'appwrite-user-avatar',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return response
}
