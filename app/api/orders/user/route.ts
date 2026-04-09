import { NextRequest, NextResponse } from 'next/server'

import { getOrdersForCustomer } from '@/lib/services/commerce-server'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

export async function GET(request: NextRequest) {
  try {
    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const authPayload = await getAuthSessionPayload(sessionSecret)

    if (!authPayload.isLoggedIn || !authPayload.user) {
      return NextResponse.json({ message: 'Please sign in to view your orders' }, { status: 401 })
    }

    const orders = await getOrdersForCustomer({
      userId: authPayload.user.id,
      email: authPayload.user.email,
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Fetching user orders failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to load orders',
      },
      { status: 500 }
    )
  }
}
