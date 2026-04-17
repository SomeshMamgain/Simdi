'use client'

import { useMemo, useState } from 'react'

import type { OrderRecord, OrderStatus } from '@/types/order'

import { EmptyOrderState } from './EmptyOrderState'
import { OrderCard } from './OrderCard'
import styles from './orders.module.css'

const FILTER_OPTIONS: Array<{ value: 'all' | OrderStatus; label: string }> = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

type SortMode = 'date_desc' | 'date_asc' | 'status'

export function OrderHistory({ orders }: { orders: OrderRecord[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [sortMode, setSortMode] = useState<SortMode>('date_desc')
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  // console.log('orders', orders)
  const filteredOrders = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return [...orders]
      .filter((order) => {
        if (statusFilter !== 'all' && order.status !== statusFilter) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        return [
          order.order_number,
          order.orderId,
          ...order.items.map((item) => item.name),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      })
      .sort((left, right) => {
        if (sortMode === 'status') {
          return left.status.localeCompare(right.status)
        }

        const leftTimestamp = new Date(left.date).getTime()
        const rightTimestamp = new Date(right.date).getTime()

        if (sortMode === 'date_asc') {
          return leftTimestamp - rightTimestamp
        }

        return rightTimestamp - leftTimestamp
      })
  }, [orders, searchQuery, sortMode, statusFilter])

  if (!orders.length) {
    return <EmptyOrderState />
  }

  return (
    <div>
      <div className={`${styles.panel} ${styles.controls}`}>
        <input
          className={styles.field}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by order number or product"
        />
        <select className={styles.select} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | OrderStatus)}>
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select className={styles.select} value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {filteredOrders.length ? (
        <div className={styles.list}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.$id}
              order={order}
              expanded={Boolean(expandedOrders[order.$id])}
              onToggle={() => setExpandedOrders((current) => ({ ...current, [order.$id]: !current[order.$id] }))}
            />
          ))}
        </div>
      ) : (
        <EmptyOrderState
          title="No orders match this view"
          copy="Try clearing the search, changing the status filter, or switching the sort order to find the order you're looking for."
          ctaLabel="Browse Products"
          ctaHref="/products"
        />
      )}
    </div>
  )
}
