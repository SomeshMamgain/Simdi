import { NextRequest, NextResponse } from 'next/server'

import { buildCheckoutPricing, createRazorpayOrder, resolveCheckoutCustomer } from '@/lib/services/commerce-server'
import { createPaymentOrderRequestSchema } from '@/lib/services/checkout-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsedRequest = createPaymentOrderRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json({ message: 'Your cart details could not be processed' }, { status: 400 })
    }

    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const customer = await resolveCheckoutCustomer(sessionSecret, parsedRequest.data.customer)
    const pricing = await buildCheckoutPricing({
      items: parsedRequest.data.items,
      handlingChargePercent: parsedRequest.data.handlingChargePercent,
      promoCode: parsedRequest.data.promoCode,
    })

    const paymentOrder = await createRazorpayOrder({
      amount: pricing.total,
      itemCount: parsedRequest.data.items.length,
    })

    return NextResponse.json({
      ...paymentOrder,
      customer,
      pricing,
    })
  } catch (error) {
    console.error('Payment initialization failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to initialize payment',
      },
      { status: 500 }
    )
  }
}
