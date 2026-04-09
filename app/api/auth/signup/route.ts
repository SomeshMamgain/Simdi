import { NextRequest, NextResponse } from 'next/server'

import { getAuthErrorMessage, getStrongPasswordValidationError } from '@/lib/auth-utils'
import { applyAuthSessionCookies, createAccountAndSession } from '@/lib/services/auth-server'
import { signupRequestSchema } from '@/lib/services/auth-schemas'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedRequest = signupRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: 'First name, last name, email, and password are required' }, { status: 400 })
    }

    const passwordError = getStrongPasswordValidationError(parsedRequest.data.password)

    if (passwordError) {
      return NextResponse.json({ message: passwordError }, { status: 400 })
    }

    const session = await createAccountAndSession(parsedRequest.data)

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
      {
        message: getAuthErrorMessage(error) || 'Signup failed. Please try again.',
      },
      { status: 400 }
    )
  }
}
