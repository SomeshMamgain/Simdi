import { addDays, format } from 'date-fns'

import { formatCurrencyAmount } from '@/lib/product-utils'
import type { DeliveryAddress, OrderRecord } from '@/types/order'

export function formatOrderDate(value?: string | null, pattern = 'dd MMM yyyy, h:mm a') {
  if (!value) {
    return 'Unavailable'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable'
  }

  return format(date, pattern)
}

export function getEstimatedDeliveryDate(order: Pick<OrderRecord, 'date' | 'type'>) {
  const baseDate = new Date(order.date)

  if (Number.isNaN(baseDate.getTime())) {
    return null
  }

  const deliveryOffset = order.type === 'express' ? 3 : order.type === 'economy' ? 6 : 5
  return addDays(baseDate, deliveryOffset)
}

export function formatEstimatedDelivery(order: Pick<OrderRecord, 'date' | 'type'>) {
  const estimatedDate = getEstimatedDeliveryDate(order)
  return estimatedDate ? format(estimatedDate, 'dd MMM yyyy') : 'To be shared soon'
}

export function formatAddress(address?: DeliveryAddress | null) {
  if (!address) {
    return 'Address unavailable'
  }

  return [
    address.fullName,
    address.phoneNumber,
    address.addressLine1,
    address.addressLine2,
    `${address.city}, ${address.state} ${address.postalCode}`.trim(),
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
}

export function getPaymentStatusLabel(paymentStatus: OrderRecord['payment_status']) {
  if (paymentStatus === 'completed') {
    return 'Paid'
  }

  if (paymentStatus === 'refunded') {
    return 'Refunded'
  }

  return paymentStatus === 'failed' ? 'Failed' : 'Pending'
}

export function formatOrderAmount(amount: number) {
  return formatCurrencyAmount(amount)
}
