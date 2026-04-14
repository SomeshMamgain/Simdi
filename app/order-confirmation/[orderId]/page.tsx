import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'

import { TrackedLink } from '@/components/analytics/TrackedLink'
import { Footer } from '@/components/footer'
import styles from '@/components/cart/cart.module.css'
import { Navbar } from '@/components/navbar'
import { getOrderById } from '@/lib/services/commerce-server'
import { formatCurrencyAmount } from '@/lib/product-utils'
import { buildMetadata } from '@/lib/seo'
import { formatEstimatedDelivery, formatOrderDate } from '@/lib/utils/orderFormatting'

type OrderConfirmationPageProps = {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = buildMetadata({
  title: 'Order Confirmation | Simdi',
  description: 'Order confirmation and receipt details for your recent Simdi purchase.',
  path: '/order-confirmation',
  index: false,
  follow: false,
  keywords: ['order confirmation', 'payment receipt', 'Simdi checkout confirmation'],
})

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = await params
  const order = await getOrderById(orderId)

  if (!order) {
    notFound()
  }

  return (
    <div className="site-page-shell">
      <Navbar />

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.confirmationLayout}>
            <div className={`${styles.card} ${styles.confirmationHero}`}>
              <span className={styles.confirmationBadge}>
                <CheckCircle2 size={18} />
                Payment Completed
              </span>

              <h1 className={styles.title} style={{ marginTop: '18px' }}>
                Your order is confirmed
              </h1>
              <p className={styles.subtitle}>
                We&apos;ve received your payment and started preparing your Simdi order. A confirmation receipt is now tied to
                your order reference below.
              </p>

              <div className={styles.confirmationMeta}>
                <div className={styles.confirmationMetaRow}>
                  <span>Order Number</span>
                  <strong>{order.order_number}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Placed on</span>
                  <strong>{formatOrderDate(order.date)}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Payment Receipt</span>
                  <strong>{order.razorpay_payment_id ?? 'Processing'}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Estimated delivery</span>
                  <strong>{formatEstimatedDelivery(order)}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Paid total</span>
                  <strong>{formatCurrencyAmount(order.total_amount)}</strong>
                </div>
              </div>

              <div className={styles.emptyActions} style={{ justifyContent: 'flex-start', marginTop: '28px' }}>
                <TrackedLink
                  href={`/orders/${order.$id}`}
                  className={styles.primaryLink}
                  eventName="view_order_details_click"
                  eventParams={{
                    category: 'CTA',
                    priority: 'tertiary',
                    page: '/order-confirmation/[orderId]',
                    order_id: order.$id,
                    order_number: order.order_number,
                  }}
                >
                  View Order Details
                </TrackedLink>
                <TrackedLink
                  href="/orders"
                  className={styles.secondaryLink}
                  eventName="order_history_click"
                  eventParams={{
                    category: 'CTA',
                    priority: 'tertiary',
                    page: '/order-confirmation/[orderId]',
                    order_id: order.$id,
                    order_number: order.order_number,
                  }}
                >
                  Order History
                </TrackedLink>
              </div>
            </div>

            <div className={styles.stack}>
              <div className={`${styles.card} ${styles.summaryCard}`} style={{ position: 'static' }}>
                <h2 className={styles.summaryTitle}>Order Breakdown</h2>
                <div className={styles.divider} />
                <div className={styles.summaryRows}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <strong>{formatCurrencyAmount(order.subtotal)}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Promo Discount</span>
                    <strong>- {formatCurrencyAmount(order.discount_amount)}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Handling Charge ({order.handling_charge_percent}%)</span>
                    <strong>{formatCurrencyAmount(order.handling_charges)}</strong>
                  </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatCurrencyAmount(order.total_amount)}</span>
                </div>
              </div>

              <div className={`${styles.card} ${styles.itemsCard}`}>
                <h2 className={styles.summaryTitle}>Items Ordered</h2>
                <div className={styles.divider} />
                <div className={styles.itemsList}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                      <img src={item.image ?? '/placeholder.jpg'} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemBody}>
                        <div className={styles.itemHeading}>
                          <div>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <div className={styles.itemMeta}>
                              {item.quantity} × {formatCurrencyAmount(item.price)}
                            </div>
                          </div>
                        </div>
                        <div className={styles.itemTotal}>
                          <span className={styles.itemTotalLabel}>Line Total</span>
                          <strong className={styles.itemTotalValue}>{formatCurrencyAmount(item.total)}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
