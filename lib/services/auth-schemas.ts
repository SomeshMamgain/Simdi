import { z } from 'zod'

export const loginRequestSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export const signupRequestSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(8),
})

export const addressFormDataSchema = z.object({
  fullName: z.string().trim().min(3),
  phoneNumber: z.string().trim().min(10),
  addressLine1: z.string().trim().min(5),
  addressLine2: z.string().trim().optional().default(''),
  city: z.string().trim().min(2),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(6),
  country: z.string().trim().default('India'),
})

export const updateProfileRequestSchema = z.object({
  fullAddress: addressFormDataSchema,
  saveForFutureOrders: z.boolean(),
})
