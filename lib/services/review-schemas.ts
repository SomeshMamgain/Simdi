import { z } from 'zod'

export const createReviewRequestSchema = z.object({
  product: z.string().trim().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  review: z.string().trim().min(10).max(2000),
})
