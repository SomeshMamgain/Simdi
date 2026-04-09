import { NextRequest, NextResponse } from 'next/server'

import { getOrderByIdForCustomer, updateOrderRecordInAppwrite } from '@/lib/services/commerce-server'
import { orderUpdateSchema } from '@/lib/services/checkout-schemas'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

function getAdminTokenFromRequest(request: NextRequest) {
  const headerToken = request.headers.get('x-admin-token')
  const authorization = request.headers.get('authorization')

  if (headerToken) {
    return headerToken
  }

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim()
  }

  return ''
}

type OrderRouteProps = {
  params: Promise<{ orderId: string }>
}

export async function GET(request: NextRequest, { params }: OrderRouteProps) {
  try {
    const { orderId } = await params
    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const authPayload = await getAuthSessionPayload(sessionSecret)

    if (!authPayload.isLoggedIn || !authPayload.user) {
      return NextResponse.json({ message: 'Please sign in to view this order' }, { status: 401 })
    }

    const order = await getOrderByIdForCustomer(orderId, {
      userId: authPayload.user.id,
      email: authPayload.user.email,
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Fetching order failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to load order',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: OrderRouteProps) {
  try {
    const configuredAdminToken = process.env.ADMIN_ORDER_UPDATE_TOKEN

    if (!configuredAdminToken) {
      return NextResponse.json(
        {
          message: 'Admin order updates are not configured',
        },
        { status: 503 }
      )
    }

    const providedToken = getAdminTokenFromRequest(request)

    if (!providedToken || providedToken !== configuredAdminToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsedBody = orderUpdateSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json({ message: 'Order update payload is invalid' }, { status: 400 })
    }

    const { orderId } = await params
    const order = await updateOrderRecordInAppwrite(orderId, parsedBody.data)

    return NextResponse.json(order)
  } catch (error) {
    console.error('Updating order failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to update order',
      },
      { status: 500 }
    )
  }
}
