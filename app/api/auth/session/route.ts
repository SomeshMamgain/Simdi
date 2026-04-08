// Server-only route handler that resolves the current signed-in user from our backend-managed session cookie.
import { NextRequest, NextResponse } from 'next/server'

import { createSessionAccount } from '@/lib/appwrite-server'

export async function GET(request: NextRequest) {
  const sessionSecret = request.cookies.get('appwrite-session')?.value

  if (!sessionSecret) {
    return NextResponse.json({ error: 'No backend session found' }, { status: 401 })
  }

  try {
    const account = createSessionAccount(sessionSecret)
    const [session, user] = await Promise.all([
      account.getSession('current'),
      account.get(),
    ])

    return NextResponse.json({ session, user })
  } catch (error) {
    console.error('Backend session lookup failed:', error)
    return NextResponse.json({ error: 'Invalid backend session' }, { status: 401 })
  }
}
