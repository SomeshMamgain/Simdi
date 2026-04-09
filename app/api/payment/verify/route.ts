import { NextResponse } from 'next/server'

import { verifyRazorpaySignature } from '@/lib/services/commerce-server'
import { paymentVerificationRequestSchema } from '@/lib/services/checkout-schemas'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedRequest = paymentVerificationRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ verified: false, message: 'Invalid payment verification payload' }, { status: 400 })
    }

    const verified = verifyRazorpaySignature({
      razorpayOrderId: parsedRequest.data.razorpayOrderId,
      razorpayPaymentId: parsedRequest.data.razorpayPaymentId,
      signature: parsedRequest.data.signature,
    })

    if (!verified) {
      return NextResponse.json({ verified: false, message: 'Payment signature verification failed' }, { status: 400 })
    }

    return NextResponse.json({
      verified: true,
      orderId: parsedRequest.data.checkoutReference,
    })
  } catch (error) {
    console.error('Payment verification failed:', error)

    return NextResponse.json({ verified: false, message: 'Unable to verify payment' }, { status: 500 })
  }
}
