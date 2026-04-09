import { NextRequest, NextResponse } from 'next/server'

import { renderOrderConfirmationEmail } from '@/components/Emails/OrderConfirmationEmail'
import { getReceiptFileName } from '@/lib/services/order-number-generator'
import { getOrderByIdForCustomer } from '@/lib/services/commerce-server'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'

type DownloadReceiptRouteProps = {
  params: Promise<{ orderId: string }>
}

export async function POST(request: NextRequest, { params }: DownloadReceiptRouteProps) {
  try {
    const sessionSecret = request.cookies.get('appwrite-session')?.value
    const authPayload = await getAuthSessionPayload(sessionSecret)

    if (!authPayload.isLoggedIn || !authPayload.user) {
      return NextResponse.json({ message: 'Please sign in to download your receipt' }, { status: 401 })
    }

    const { orderId } = await params
    const order = await getOrderByIdForCustomer(orderId, {
      userId: authPayload.user.id,
      email: authPayload.user.email,
    })

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    const appName = process.env.APP_NAME || process.env.NEXT_PUBLIC_STORE_NAME || 'SIMDI'
    const supportEmail = process.env.APP_SUPPORT_EMAIL || process.env.ZOHO_MAIL_USER || 'support@simdi.in'
    const logoUrl = process.env.APP_LOGO_URL || undefined
    const html = renderOrderConfirmationEmail({
      order,
      appName,
      supportEmail,
      logoUrl,
      orderUrl: undefined,
    })

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${getReceiptFileName(order)}"`,
      },
    })
  } catch (error) {
    console.error('Downloading order receipt failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to download the receipt',
      },
      { status: 500 }
    )
  }
}
