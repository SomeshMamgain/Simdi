import { NextRequest, NextResponse } from 'next/server'

import { validateAddressForm } from '@/lib/address-utils'
import { updateProfileRequestSchema } from '@/lib/services/auth-schemas'
import { getAuthSessionPayload, updateCurrentUserProfile } from '@/lib/services/user-profile-server'

export async function GET(request: NextRequest) {
  const sessionSecret = request.cookies.get('appwrite-session')?.value
  const avatarUrl = request.cookies.get('appwrite-user-avatar')?.value ?? null
  const payload = await getAuthSessionPayload(sessionSecret, avatarUrl)

  if (!payload.isLoggedIn) {
    return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 })
  }

  return NextResponse.json(
    {
      success: true,
      ...payload,
    },
    { status: 200 }
  )
}

export async function PUT(request: NextRequest) {
  const sessionSecret = request.cookies.get('appwrite-session')?.value
  const avatarUrl = request.cookies.get('appwrite-user-avatar')?.value ?? null

  if (!sessionSecret) {
    return NextResponse.json({ message: 'Please sign in to save your address' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsedRequest = updateProfileRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: 'Your address details are incomplete' }, { status: 400 })
    }

    const validationErrors = validateAddressForm(parsedRequest.data.fullAddress)

    if (Object.values(validationErrors).some(Boolean)) {
      return NextResponse.json({ message: Object.values(validationErrors).find(Boolean) ?? 'Invalid address details' }, { status: 400 })
    }

    const result = await updateCurrentUserProfile(sessionSecret, parsedRequest.data)

    return NextResponse.json(
      {
        success: true,
        isLoggedIn: true,
        user: result.user,
        profile: result.profile,
        avatarUrl,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to save address',
      },
      { status: 500 }
    )
  }
}
