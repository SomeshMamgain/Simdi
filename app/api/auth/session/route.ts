// Server-only route handler that resolves the current signed-in user from our backend-managed session cookie.
import { NextRequest, NextResponse } from 'next/server'

import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

export async function GET(request: NextRequest) {
  const sessionSecret = request.cookies.get('appwrite-session')?.value
  const avatarUrl = request.cookies.get('appwrite-user-avatar')?.value ?? null
  const payload = await getAuthSessionPayload(sessionSecret, avatarUrl)

  if (!payload.isLoggedIn) {
    return NextResponse.json(
      {
        success: false,
        ...payload,
      },
      { status: 200 }
    )
  }

  return NextResponse.json(
    {
      success: true,
      ...payload,
    },
    { status: 200 }
  )
}
