import { NextResponse } from 'next/server'

import { validatePromoCodeOnServer } from '@/lib/services/commerce-server'
import { promoValidationRequestSchema } from '@/lib/services/checkout-schemas'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsedRequest = promoValidationRequestSchema.safeParse(body)

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          valid: false,
          discountPercent: 0,
          discountAmount: 0,
          message: 'Enter a valid promo code',
        },
        { status: 400 }
      )
    }

    const result = await validatePromoCodeOnServer(parsedRequest.data.code, parsedRequest.data.subtotal)

    return NextResponse.json(result, { status: result.valid ? 200 : 400 })
  } catch (error) {
    console.error('Promo validation failed:', error)

    return NextResponse.json(
      {
        valid: false,
        discountPercent: 0,
        discountAmount: 0,
        message: 'Promo codes are unavailable right now',
      },
      { status: 500 }
    )
  }
}
