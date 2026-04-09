import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { EmptyOrderState } from '@/components/Orders/EmptyOrderState'
import { OrderDetails } from '@/components/Orders/OrderDetails'
import styles from '@/components/Orders/orders.module.css'
import { getOrderByIdForCustomer } from '@/lib/services/commerce-server'
import { formatOrderDate } from '@/lib/utils/orderFormatting'
import { getOrderStatusDisplay } from '@/lib/utils/statusBadges'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Order Details | Simdi',
  description: 'View the full details for your Simdi order, including items, payment status, and tracking progress.',
  path: '/orders',
  index: false,
  follow: false,
  keywords: ['order details', 'track order', 'Simdi receipt'],
})

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params
  const cookieStore = await cookies()
  const sessionSecret = cookieStore.get('appwrite-session')?.value
  const authPayload = await getAuthSessionPayload(sessionSecret)

  if (!authPayload.user) {
    return (
      <div className="site-page-shell">
        <Navbar />
        <section className={styles.section}>
          <div className={styles.shell}>
            <EmptyOrderState
              title="Sign in to access this order"
              copy="Order details are only shown to the account that placed the order."
              ctaLabel="Back to Shopping"
              ctaHref="/products"
            />
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const order = await getOrderByIdForCustomer(orderId, {
    userId: authPayload.user.id,
    email: authPayload.user.email,
  })

  if (!order) {
    notFound()
  }

  const statusDisplay = getOrderStatusDisplay(order.status)

  return (
    <div className="site-page-shell">
      <Navbar />

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>Order Details</span>
              <h1 className={styles.title}>{order.order_number}</h1>
              <p className={styles.subtitle}>
                Placed on {formatOrderDate(order.date)}. Review the full receipt, delivery progress, and support options below.
              </p>
            </div>
            <span
              className={styles.statusBadge}
              style={{
                color: statusDisplay.color,
                backgroundColor: statusDisplay.bgColor,
                border: `1px solid ${statusDisplay.badge}`,
              }}
            >
              {statusDisplay.label}
            </span>
          </div>

          <div className={`${styles.panel} ${styles.expanded}`}>
            <div className={styles.cardActions} style={{ padding: 0, marginBottom: '18px' }}>
              <div className={styles.itemPreview}>
                {order.items.length} item{order.items.length === 1 ? '' : 's'} in this order.
              </div>
              <div className={styles.actionGroup}>
                <Link href="/orders" className={styles.button}>
                  Back to Orders
                </Link>
              </div>
            </div>
            <OrderDetails order={order} detailPage />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
