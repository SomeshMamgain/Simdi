import type { OrderStatus, OrderStatusDisplay } from '@/types/order'

export const ORDER_STATUS_DISPLAY: Record<OrderStatus, OrderStatusDisplay> = {
  pending: {
    label: 'Pending',
    color: '#8a5d00',
    bgColor: '#fff6db',
    badge: '#ffe8a3',
    icon: 'Clock3',
  },
  confirmed: {
    label: 'Confirmed',
    color: '#0b5cab',
    bgColor: '#e7f1ff',
    badge: '#bfd8ff',
    icon: 'BadgeCheck',
  },
  processing: {
    label: 'Processing',
    color: '#0b5cab',
    bgColor: '#eaf3ff',
    badge: '#cfe0ff',
    icon: 'PackageCheck',
  },
  in_transit: {
    label: 'In Transit',
    color: '#612cab',
    bgColor: '#f1e8ff',
    badge: '#dcc8ff',
    icon: 'Truck',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: '#ad5400',
    bgColor: '#fff0e0',
    badge: '#ffd0a6',
    icon: 'MapPinned',
  },
  delivered: {
    label: 'Delivered',
    color: '#176539',
    bgColor: '#e8f7ec',
    badge: '#c6ebd0',
    icon: 'CircleCheckBig',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#9d2f2f',
    bgColor: '#fdecec',
    badge: '#f8caca',
    icon: 'CircleX',
  },
}

export function getOrderStatusDisplay(status: OrderStatus) {
  return ORDER_STATUS_DISPLAY[status]
}
