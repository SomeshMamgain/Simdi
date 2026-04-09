'use client'

import Link from 'next/link'

import { ChevronDown, ChevronUp } from 'lucide-react'

import { formatCurrencyAmount } from '@/lib/product-utils'
import { formatOrderDate } from '@/lib/utils/orderFormatting'
import { getOrderStatusDisplay } from '@/lib/utils/statusBadges'
import type { OrderRecord } from '@/types/order'

import { OrderDetails } from './OrderDetails'
import styles from './orders.module.css'

interface OrderCardProps {
  order: OrderRecord
  expanded: boolean
  onToggle: () => void
}

export function OrderCard({ order, expanded, onToggle }: OrderCardProps) {
  const statusDisplay = getOrderStatusDisplay(order.status)
  const itemPreview = order.items.slice(0, 3).map((item) => item.name).join(', ')

  return (
    <div className={`${styles.panel} ${styles.orderCard}`}>
      <div className={styles.orderCardHeader}>
        <div>
          <div className={styles.orderNumber}>{order.order_number}</div>
          <div className={styles.orderMeta}>
            {formatOrderDate(order.date)} · {order.items.length} item{order.items.length === 1 ? '' : 's'}
          </div>
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

        <div className={styles.orderAmount}>
          <span className={styles.orderAmountLabel}>Order Total</span>
          <span className={styles.orderAmountValue}>{formatCurrencyAmount(order.total_amount)}</span>
        </div>
      </div>

      <div className={styles.cardActions}>
        <div className={styles.itemPreview}>{itemPreview || 'Order items will appear here once available.'}</div>
        <div className={styles.actionGroup}>
          <button className={styles.button} onClick={onToggle}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{expanded ? 'Hide Details' : 'View Details'}</span>
          </button>
          <Link href={`/orders/${order.$id}`} className={styles.linkButton}>
            Open Order Page
          </Link>
        </div>
      </div>

      {expanded ? (
        <div className={styles.expanded}>
          <OrderDetails order={order} />
        </div>
      ) : null}
    </div>
  )
}
