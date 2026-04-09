// Server-only route handler that clears the backend-managed Appwrite session cookie and current session.
import { NextRequest, NextResponse } from 'next/server'

import { createSessionAccount } from '@/lib/appwrite-server'
import { clearAuthSessionCookies } from '@/lib/services/auth-server'

export async function POST(request: NextRequest) {
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

  clearAuthSessionCookies(response)

  return response
}
