import type { AddressFormData } from '@/types/address'
import type { AuthApiResponse } from '@/types/auth'

export async function fetchUserProfile() {
  const response = await fetch('/api/user/profile', {
    credentials: 'include',
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null) as AuthApiResponse | { message?: string } | null

  if (!response.ok) {
    throw new Error((payload && 'message' in payload ? payload.message : undefined) ?? 'Unable to load your profile')
  }

  return payload as AuthApiResponse
}

export async function updateUserProfile(input: {
  fullAddress: AddressFormData
  saveForFutureOrders: boolean
}) {
  const response = await fetch('/api/user/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  const payload = await response.json().catch(() => null) as AuthApiResponse | { message?: string } | null

  if (!response.ok) {
    throw new Error((payload && 'message' in payload ? payload.message : undefined) ?? 'Unable to save your delivery address')
  }

  return payload as AuthApiResponse
}
