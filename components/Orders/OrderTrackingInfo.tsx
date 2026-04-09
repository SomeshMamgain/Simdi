import { formatEstimatedDelivery, formatOrderDate, getPaymentStatusLabel } from '@/lib/utils/orderFormatting'
import type { OrderRecord } from '@/types/order'

import styles from './orders.module.css'

export function OrderTrackingInfo({ order }: { order: OrderRecord }) {
  return (
    <div className={styles.subCard}>
      <h3 className={styles.subCardTitle}>Tracking & Payment</h3>
      <div className={styles.miniGrid}>
        <div className={styles.miniMeta}>
          <span className={styles.miniMetaLabel}>Tracking Number</span>
          <span className={styles.miniMetaValue}>{order.tracking_number || 'Will be assigned after dispatch'}</span>
        </div>
        <div className={styles.miniMeta}>
          <span className={styles.miniMetaLabel}>Expected Delivery</span>
          <span className={styles.miniMetaValue}>{formatEstimatedDelivery(order)}</span>
        </div>
        <div className={styles.miniMeta}>
          <span className={styles.miniMetaLabel}>Payment Receipt</span>
          <span className={styles.miniMetaValue}>{order.razorpay_payment_id || 'Processing'}</span>
        </div>
        <div className={styles.miniMeta}>
          <span className={styles.miniMetaLabel}>Payment Status</span>
          <span className={styles.miniMetaValue}>{getPaymentStatusLabel(order.payment_status)}</span>
        </div>
      </div>
      <p className={styles.helperText}>
        {order.tracking_number
          ? `Tracking number ${order.tracking_number} was last updated on ${formatOrderDate(order.$updatedAt)}.`
          : 'Tracking details will appear here once your parcel is booked with the courier.'}
      </p>
    </div>
  )
}
