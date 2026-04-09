import { NextRequest, NextResponse } from 'next/server'

import { buildCheckoutPricing, createOrderRecordInAppwrite, resolveCheckoutCustomer, verifyRazorpaySignature } from '@/lib/services/commerce-server'
import { createOrderRequestSchema } from '@/lib/services/checkout-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedRequest = createOrderRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: 'Order data is incomplete' }, { status: 400 })
    }

    const verified = verifyRazorpaySignature({
      razorpayOrderId: parsedRequest.data.razorpayOrderId,
      razorpayPaymentId: parsedRequest.data.razorpayPaymentId,
      signature: parsedRequest.data.signature,
    })

    if (!verified) {
      return NextResponse.json({ message: 'Payment could not be verified' }, { status: 400 })
    }

    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const customer = await resolveCheckoutCustomer(sessionSecret, parsedRequest.data.customer)
    const pricing = await buildCheckoutPricing({
      items: parsedRequest.data.items,
      handlingChargePercent: parsedRequest.data.pricing.handlingChargePercent,
      promoCode: parsedRequest.data.pricing.promo?.code,
    })

    const order = await createOrderRecordInAppwrite({
      checkoutReference: parsedRequest.data.checkoutReference,
      items: parsedRequest.data.items,
      pricing,
      customer,
      razorpayOrderId: parsedRequest.data.razorpayOrderId,
      razorpayPaymentId: parsedRequest.data.razorpayPaymentId,
      paymentStatus: 'completed',
    })

    return NextResponse.json({
      orderId: order.orderId,
      status: order.paymentStatus,
      order,
    })
  } catch (error) {
    console.error('Order creation failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to create order',
      },
      { status: 500 }
    )
  }
}
