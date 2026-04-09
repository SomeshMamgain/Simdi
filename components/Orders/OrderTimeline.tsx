import { formatOrderDate } from '@/lib/utils/orderFormatting'
import type { OrderRecord, OrderStatus } from '@/types/order'

import styles from './orders.module.css'

const ORDER_FLOW: Array<{ key: OrderStatus; label: string; dateKey?: keyof OrderRecord }> = [
  { key: 'pending', label: 'Order Placed', dateKey: 'date' },
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'in_transit', label: 'In Transit', dateKey: 'in_transit' },
  { key: 'out_for_delivery', label: 'Out for Delivery', dateKey: 'out_for_delivery' },
  { key: 'delivered', label: 'Delivered', dateKey: 'delivered_date' },
]

const ORDER_STATUS_POSITION: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

function hasReachedStep(currentStatus: OrderStatus, targetStatus: OrderStatus) {
  if (currentStatus === 'cancelled') {
    return targetStatus === 'pending'
  }

  return ORDER_STATUS_POSITION.indexOf(currentStatus) >= ORDER_STATUS_POSITION.indexOf(targetStatus)
}

export function OrderTimeline({ order }: { order: OrderRecord }) {
  return (
    <div className={styles.timeline}>
      {ORDER_FLOW.map((step) => {
        const isComplete = hasReachedStep(order.status, step.key)
        const rawDate = step.dateKey ? order[step.dateKey] : undefined
        const formattedDate = typeof rawDate === 'string'
          ? formatOrderDate(rawDate)
          : isComplete
            ? 'Updated recently'
            : 'Waiting'

        return (
          <div key={step.key} className={styles.timelineItem}>
            <span className={`${styles.timelineDot} ${isComplete ? styles.timelineDotActive : ''}`} />
            <div>
              <span className={styles.timelineLabel}>{step.label}</span>
              <span className={styles.timelineDate}>{formattedDate}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
