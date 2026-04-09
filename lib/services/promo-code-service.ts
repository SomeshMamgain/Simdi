import type { PromoValidationResult } from '@/types/promo'

export async function validatePromoCode(code: string, subtotal: number) {
  const response = await fetch('/api/promo/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      subtotal,
    }),
  })

  const payload = await response.json().catch(() => null) as PromoValidationResult | { message?: string } | null

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Unable to validate promo code')
  }

  return payload as PromoValidationResult
}
