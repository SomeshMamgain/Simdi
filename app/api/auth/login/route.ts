import { NextRequest, NextResponse } from 'next/server'

import { getAuthErrorMessage } from '@/lib/auth-utils'
import { applyAuthSessionCookies, createPublicAccountClient } from '@/lib/services/auth-server'
import { loginRequestSchema } from '@/lib/services/auth-schemas'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedRequest = loginRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    const account = createPublicAccountClient()
    const session = await account.createEmailPasswordSession({
      email: parsedRequest.data.email,
      password: parsedRequest.data.password,
    })

    if (!session.secret) {
      throw new Error('Session could not be created')
    }

    const payload = await getAuthSessionPayload(session.secret)
    const response = NextResponse.json(
      {
        success: true,
        ...payload,
      },
      { status: 200 }
    )

    applyAuthSessionCookies(response, session.secret)

    return response
  } catch (error) {
    return NextResponse.json(
      { message: getAuthErrorMessage(error) || 'Invalid email or password' },
      { status: 401 }
    )
  }
}
