import type { OrderRecord } from '@/types/order'

export function formatOrderSequence(sequence: number) {
  return `${Math.max(1, sequence)}`.padStart(6, '0')
}

export function generateOrderNumber(input: {
  sequence?: number | null
  date?: string | Date | null
  fallbackId?: string | null
}) {
  const date = input.date ? new Date(input.date) : new Date()
  const year = Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear()

  if (typeof input.sequence === 'number' && Number.isFinite(input.sequence) && input.sequence > 0) {
    return `ORD-${year}-${formatOrderSequence(input.sequence)}`
  }

  const digits = (input.fallbackId ?? '')
    .replace(/\D/g, '')
    .slice(-6)

  return `ORD-${year}-${digits.padStart(6, '0') || '000001'}`
}

export function getReceiptFileName(order: Pick<OrderRecord, 'order_number'>) {
  return `Order-${order.order_number}.html`
}
