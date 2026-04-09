import { z } from 'zod'

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
})

export const promoValidationRequestSchema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().nonnegative(),
})

export const createPaymentOrderRequestSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  promoCode: z.string().trim().optional().nullable(),
  handlingChargePercent: z.union([z.literal(5), z.literal(10)]),
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
    handlingChargePercent: z.union([z.literal(5), z.literal(10)]),
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
})
