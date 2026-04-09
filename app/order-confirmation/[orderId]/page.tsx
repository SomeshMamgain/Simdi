import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/footer'
import styles from '@/components/cart/cart.module.css'
import { Navbar } from '@/components/navbar'
import { getOrderById } from '@/lib/services/commerce-server'
import { formatCurrencyAmount } from '@/lib/product-utils'

type OrderConfirmationPageProps = {
  params: Promise<{ orderId: string }>
}

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
                  <span>Order ID</span>
                  <strong>{order.orderId}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Payment Receipt</span>
                  <strong>{order.razorpayPaymentId ?? 'Processing'}</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Estimated delivery</span>
                  <strong>4-7 business days</strong>
                </div>
                <div className={styles.confirmationMetaRow}>
                  <span>Paid total</span>
                  <strong>{formatCurrencyAmount(order.total)}</strong>
                </div>
              </div>

              <div className={styles.emptyActions} style={{ justifyContent: 'flex-start', marginTop: '28px' }}>
                <Link href="/shop" className={styles.primaryLink}>
                  Continue Shopping
                </Link>
                <Link href="/cart" className={styles.secondaryLink}>
                  View Cart
                </Link>
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
                    <strong>- {formatCurrencyAmount(order.promoDiscount)}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Handling Charge ({order.handlingChargePercent}%)</span>
                    <strong>{formatCurrencyAmount(order.handlingCharge)}</strong>
                  </div>
                </div>
                <div className={styles.divider} />
                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{formatCurrencyAmount(order.total)}</span>
                </div>
              </div>

              <div className={`${styles.card} ${styles.itemsCard}`}>
                <h2 className={styles.summaryTitle}>Items Ordered</h2>
                <div className={styles.divider} />
                <div className={styles.itemsList}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
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
                          <strong className={styles.itemTotalValue}>{formatCurrencyAmount(item.price * item.quantity)}</strong>
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
