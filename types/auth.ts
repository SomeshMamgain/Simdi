import type { AddressFormData } from '@/types/address'

export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  userId: string
  email: string
  name: string
  phone: string
  fullAddress: AddressFormData
  savedForFutureOrders?: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthSessionPayload {
  isLoggedIn: boolean
  user: AuthUser | null
  profile: UserProfile | null
  avatarUrl?: string | null
}

export interface AuthApiResponse extends AuthSessionPayload {
  success: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  password: string
}
