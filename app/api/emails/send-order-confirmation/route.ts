import { NextRequest, NextResponse } from 'next/server'

import { getOrderByIdForCustomer, updateOrderRecordInAppwrite } from '@/lib/services/commerce-server'
import { orderEmailRequestSchema } from '@/lib/services/checkout-schemas'
import { sendOrderConfirmationEmail } from '@/lib/services/emailService'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

export async function POST(request: NextRequest) {
  try {
    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const authPayload = await getAuthSessionPayload(sessionSecret)

    if (!authPayload.isLoggedIn || !authPayload.user) {
      return NextResponse.json({ message: 'Please sign in to resend order emails' }, { status: 401 })
    }

    const body = await request.json()
    const parsedBody = orderEmailRequestSchema.safeParse(body)

    if (!parsedBody.success) {
      return NextResponse.json({ message: 'Order email payload is invalid' }, { status: 400 })
    }

    const order = await getOrderByIdForCustomer(parsedBody.data.orderId, {
      userId: authPayload.user.id,
      email: authPayload.user.email,
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    const result = await sendOrderConfirmationEmail(order)
    const finalOrder = order.status === 'pending'
      ? await updateOrderRecordInAppwrite(order.$id, { status: 'confirmed' })
      : order

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      order: finalOrder,
    })
  } catch (error) {
    console.error('Sending order confirmation email failed:', error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unable to send order confirmation email',
      },
      { status: 500 }
    )
  }
}
