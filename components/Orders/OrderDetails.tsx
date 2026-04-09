'use client'

import Link from 'next/link'
import { useState } from 'react'

import { Mail, Receipt, Truck } from 'lucide-react'
import { toast } from 'sonner'

import { downloadOrderReceipt, resendOrderConfirmationEmail } from '@/lib/services/order-service'
import { formatCurrencyAmount } from '@/lib/product-utils'
import { formatAddress, formatOrderDate, getPaymentStatusLabel } from '@/lib/utils/orderFormatting'
import type { OrderRecord } from '@/types/order'

import { OrderTimeline } from './OrderTimeline'
import { OrderTrackingInfo } from './OrderTrackingInfo'
import styles from './orders.module.css'

interface OrderDetailsProps {
  order: OrderRecord
  detailPage?: boolean
}

export function OrderDetails({ order, detailPage = false }: OrderDetailsProps) {
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@simdi.in'

  const handleDownloadReceipt = async () => {
    try {
      setIsDownloadingReceipt(true)
      await downloadOrderReceipt(order.$id)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to download the receipt')
    } finally {
      setIsDownloadingReceipt(false)
    }
  }

  const handleResendEmail = async () => {
    try {
      setIsResendingEmail(true)
      await resendOrderConfirmationEmail(order.$id)
      toast.success('Order confirmation email sent again.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to resend the confirmation email')
    } finally {
      setIsResendingEmail(false)
    }
  }

  return (
    <div className={styles.detailsGrid}>
      <div className={styles.detailsStack}>
        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Order Snapshot</h3>
          <div className={styles.miniGrid}>
            <div className={styles.miniMeta}>
              <span className={styles.miniMetaLabel}>Order Number</span>
              <span className={styles.miniMetaValue}>{order.order_number}</span>
            </div>
            <div className={styles.miniMeta}>
              <span className={styles.miniMetaLabel}>Placed On</span>
              <span className={styles.miniMetaValue}>{formatOrderDate(order.date)}</span>
            </div>
            <div className={styles.miniMeta}>
              <span className={styles.miniMetaLabel}>Payment Method</span>
              <span className={styles.miniMetaValue}>{order.payment_method.toUpperCase()}</span>
            </div>
            <div className={styles.miniMeta}>
              <span className={styles.miniMetaLabel}>Payment Status</span>
              <span className={styles.miniMetaValue}>{getPaymentStatusLabel(order.payment_status)}</span>
            </div>
          </div>
        </div>

        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Items Purchased</h3>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name}
                    {item.variant ? <span className={styles.helperText}>{item.variant}</span> : null}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrencyAmount(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Pricing Breakdown</h3>
          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <strong>{formatCurrencyAmount(order.subtotal)}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>{`Discount${order.discount_percent ? ` (${order.discount_percent}%)` : ''}`}</span>
              <strong>{`- ${formatCurrencyAmount(order.discount_amount)}`}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>{`Handling Charges (${order.handling_charge_percent}%)`}</span>
              <strong>{formatCurrencyAmount(order.handling_charges)}</strong>
            </div>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total Paid</span>
            <span>{formatCurrencyAmount(order.total_amount)}</span>
          </div>
        </div>

        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Delivery Address</h3>
          <p className={styles.addressText}>{formatAddress(order.delivery_address)}</p>
        </div>
      </div>

      <div className={styles.detailsStack}>
        <OrderTrackingInfo order={order} />

        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Order Timeline</h3>
          <OrderTimeline order={order} />
          {order.status === 'cancelled' ? (
            <p className={styles.helperText}>This order has been cancelled. Contact support if you need help with payment or refunds.</p>
          ) : null}
        </div>

        <div className={styles.subCard}>
          <h3 className={styles.subCardTitle}>Quick Actions</h3>
          <div className={styles.actionGroup}>
            <button className={styles.button} onClick={handleDownloadReceipt} disabled={isDownloadingReceipt}>
              <Receipt size={16} />
              <span>{isDownloadingReceipt ? 'Preparing Receipt...' : 'Download Receipt'}</span>
            </button>
            <button className={styles.button} onClick={handleResendEmail} disabled={isResendingEmail}>
              <Mail size={16} />
              <span>{isResendingEmail ? 'Sending...' : 'Resend Email'}</span>
            </button>
            {detailPage ? (
              <Link
                href={order.tracking_number ? `https://www.google.com/search?q=${encodeURIComponent(order.tracking_number)}` : '#'}
                className={styles.linkButton}
                target={order.tracking_number ? '_blank' : undefined}
                rel={order.tracking_number ? 'noreferrer' : undefined}
                aria-disabled={!order.tracking_number}
              >
                <Truck size={16} />
                <span>Track Order</span>
              </Link>
            ) : null}
          </div>
          <p className={styles.helperText}>
            Need a hand? Email <a href={`mailto:${supportEmail}`}>{supportEmail}</a> and mention {order.order_number}.
          </p>
        </div>
      </div>
    </div>
  )
}
