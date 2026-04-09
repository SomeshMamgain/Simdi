import { z } from 'zod'

import { addressFormDataSchema } from '@/lib/services/auth-schemas'

export const cartItemSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  image: z.string().min(1),
  inStock: z.boolean(),
  stock: z.number().nullable().optional(),
  unit: z.string().optional(),
  variant: z.string().optional(),
})

export const orderCustomerSchema = z.object({
  userId: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  contact: z.string().optional(),
  deliveryAddress: addressFormDataSchema.optional(),
})

export const promoValidationRequestSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().nonnegative(),
})

export const createPaymentOrderRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  promoCode: z.string().trim().optional().nullable(),
  handlingChargePercent: z.literal(5),
  customer: orderCustomerSchema.optional(),
})

export const paymentVerificationRequestSchema = z.object({
  checkoutReference: z.string().trim().min(1),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  signature: z.string().trim().min(1),
})

export const createOrderRequestSchema = z.object({
  checkoutReference: z.string().trim().min(1),
  items: z.array(cartItemSchema).min(1),
  pricing: z.object({
    subtotal: z.number().nonnegative(),
    promoDiscount: z.number().nonnegative(),
    handlingCharge: z.number().nonnegative(),
    handlingChargePercent: z.literal(5),
    total: z.number().nonnegative(),
    promo: z
      .object({
        code: z.string(),
        discountPercent: z.number().nonnegative(),
        discountAmount: z.number().nonnegative(),
        minimumPurchase: z.number().nullable().optional(),
        message: z.string().optional(),
      })
      .nullable()
      .optional(),
  }),
  customer: orderCustomerSchema.optional(),
  razorpayOrderId: z.string().trim().min(1),
  razorpayPaymentId: z.string().trim().min(1),
  signature: z.string().trim().min(1),
  type: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(500).optional(),
})

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
])

export const paymentStatusSchema = z.enum([
  'pending',
  'completed',
  'failed',
  'refunded',
])

export const refundStatusSchema = z.enum([
  'none',
  'pending',
  'completed',
])

export const orderUpdateSchema = z.object({
  status: orderStatusSchema.optional(),
  tracking_number: z.string().trim().max(50).optional(),
  in_transit: z.string().datetime().optional(),
  out_for_delivery: z.string().datetime().optional(),
  delivered_date: z.string().datetime().optional(),
  admin_notes: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(500).optional(),
  refund_status: refundStatusSchema.optional(),
  refund_amount: z.number().nonnegative().optional(),
  payment_status: paymentStatusSchema.optional(),
  type: z.string().trim().max(50).optional(),
}).refine((value) => Object.values(value).some((field) => field !== undefined), {
  message: 'At least one field is required to update the order',
})

export const orderEmailRequestSchema = z.object({
  orderId: z.string().trim().min(1),
})
