import 'server-only'

import type { Models } from 'node-appwrite'

import { createSessionAccount } from '@/lib/appwrite-server'
import { normalizeAddressFormData } from '@/lib/address-utils'
import type { AddressFormData } from '@/types/address'
import type { AuthSessionPayload, AuthUser, UserProfile } from '@/types/auth'
import type { OrderCustomer } from '@/types/order'

interface StoredUserPreferences extends Models.Preferences {
  simdiProfile?: UserProfile | null
}

function mapUser(user: Models.User<StoredUserPreferences>): AuthUser {
  return {
    id: user.$id,
    email: user.email,
    name: user.name,
    phone: user.phone || undefined,
    createdAt: user.$createdAt,
    updatedAt: user.$updatedAt,
  }
}

function isAddressLike(value: unknown): value is Partial<AddressFormData> {
  return Boolean(value) && typeof value === 'object'
}

export function normalizeUserProfile(
  user: Pick<Models.User<StoredUserPreferences>, '$id' | 'email' | 'name' | 'prefs' | '$createdAt' | '$updatedAt' | 'phone'>,
  rawProfile?: unknown
) {
  const candidate = rawProfile ?? user.prefs?.simdiProfile

  if (!candidate || typeof candidate !== 'object') {
    return null
  }

  const record = candidate as Partial<UserProfile> & { fullAddress?: unknown }

  if (!isAddressLike(record.fullAddress)) {
    return null
  }

  const fullAddress = normalizeAddressFormData(record.fullAddress)

  return {
    userId: record.userId?.trim() || user.$id,
    email: record.email?.trim() || user.email,
    name: record.name?.trim() || user.name || fullAddress.fullName,
    phone: record.phone?.trim() || fullAddress.phoneNumber || user.phone || '',
    fullAddress,
    savedForFutureOrders: record.savedForFutureOrders ?? false,
    createdAt: record.createdAt || user.$createdAt,
    updatedAt: record.updatedAt || user.$updatedAt,
  } satisfies UserProfile
}

export async function getAuthSessionPayload(sessionSecret?: string, avatarUrl?: string | null): Promise<AuthSessionPayload> {
  if (!sessionSecret) {
    return {
      isLoggedIn: false,
      user: null,
      profile: null,
      avatarUrl: avatarUrl ?? null,
    }
  }

  try {
    const account = createSessionAccount(sessionSecret)
    const user = await account.get<StoredUserPreferences>()

    return {
      isLoggedIn: true,
      user: mapUser(user),
      profile: normalizeUserProfile(user),
      avatarUrl: avatarUrl ?? null,
    }
  } catch {
    return {
      isLoggedIn: false,
      user: null,
      profile: null,
      avatarUrl: null,
    }
  }
}

export async function updateCurrentUserProfile(
  sessionSecret: string,
  input: {
    fullAddress: AddressFormData
    saveForFutureOrders: boolean
  }
) {
  const account = createSessionAccount(sessionSecret)
  const currentUser = await account.get<StoredUserPreferences>()
  const existingProfile = normalizeUserProfile(currentUser)
  const normalizedAddress = normalizeAddressFormData(input.fullAddress)
  const now = new Date().toISOString()
  const nextProfile: UserProfile = {
    userId: currentUser.$id,
    email: currentUser.email,
    name: normalizedAddress.fullName || currentUser.name || existingProfile?.name || '',
    phone: normalizedAddress.phoneNumber,
    fullAddress: normalizedAddress,
    savedForFutureOrders: input.saveForFutureOrders,
    createdAt: existingProfile?.createdAt ?? now,
    updatedAt: now,
  }

  if (nextProfile.name && nextProfile.name !== currentUser.name) {
    try {
      await account.updateName({ name: nextProfile.name })
    } catch {
      // Keep checkout moving even if the Appwrite account display name cannot be updated.
    }
  }

  const updatedUser = await account.updatePrefs<StoredUserPreferences>({
    prefs: {
      ...currentUser.prefs,
      simdiProfile: nextProfile,
    },
  })

  return {
    user: mapUser(updatedUser),
    profile: normalizeUserProfile(updatedUser, nextProfile) ?? nextProfile,
  }
}

export function buildOrderCustomer(input: {
  user?: AuthUser | null
  profile?: UserProfile | null
  fallback?: OrderCustomer | null
}): OrderCustomer | undefined {
  const deliveryAddress = input.fallback?.deliveryAddress ?? input.profile?.fullAddress
  const name = input.fallback?.name ?? input.profile?.fullAddress.fullName ?? input.profile?.name ?? input.user?.name
  const email = input.fallback?.email ?? input.profile?.email ?? input.user?.email
  const contact = input.fallback?.contact ?? input.profile?.fullAddress.phoneNumber ?? input.profile?.phone ?? input.user?.phone
  const userId = input.fallback?.userId ?? input.profile?.userId ?? input.user?.id

  if (!name && !email && !contact && !userId && !deliveryAddress) {
    return undefined
  }

  return {
    userId,
    name,
    email,
    contact,
    deliveryAddress,
  }
}
