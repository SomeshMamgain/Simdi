import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { EmptyOrderState } from '@/components/Orders/EmptyOrderState'
import { OrderHistory } from '@/components/Orders/OrderHistory'
import styles from '@/components/Orders/orders.module.css'
import { getOrdersForCustomer } from '@/lib/services/commerce-server'
import { getAuthSessionPayload } from '@/lib/services/user-profile-server'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Your Orders | Simdi',
  description: 'Review your Simdi orders, receipts, payment updates, and delivery progress.',
  path: '/orders',
  index: false,
  follow: false,
  keywords: ['order history', 'Simdi orders', 'track your order'],
})

export default async function OrdersPage() {
  const cookieStore = await cookies()
  const sessionSecret = cookieStore.get('appwrite-session')?.value
  const authPayload = await getAuthSessionPayload(sessionSecret)
  const orders = authPayload.user
    ? await getOrdersForCustomer({
        userId: authPayload.user.id,
        email: authPayload.user.email,
      })
    : []

  return (
    <div className="site-page-shell">
      <Navbar />

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.header}>
            <div>
              <span className={styles.eyebrow}>Order History</span>
              <h1 className={styles.title}>Your Orders</h1>
              <p className={styles.subtitle}>
                Keep track of every Simdi purchase in one place, from the moment it is placed to the day it reaches your
                doorstep.
              </p>
            </div>
            <div className={styles.summaryPill}>
              {authPayload.user ? `${orders.length} order${orders.length === 1 ? '' : 's'} on file` : 'Sign in to unlock tracking'}
            </div>
          </div>

          {authPayload.user ? (
            <OrderHistory orders={orders} />
          ) : (
            <EmptyOrderState
              title="Sign in to see your orders"
              copy="Your saved order history, receipt downloads, and shipment progress are available once you sign in with the account you used at checkout."
              ctaLabel="Continue Shopping"
              ctaHref="/products"
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
