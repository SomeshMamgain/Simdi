import type { AddressFormData } from '@/types/address'
import type { UserProfile } from '@/types/auth'

export type CheckoutStep = 'idle' | 'auth' | 'address' | 'payment' | 'complete'

export interface CheckoutAddressSubmission {
  profile: UserProfile
  saveForFutureOrders: boolean
}

export interface CheckoutState {
  currentStep: CheckoutStep
  isAuthModalOpen: boolean
  isAddressModalOpen: boolean
  pendingAddress: AddressFormData | null
  lastSubmittedProfile: UserProfile | null
  openAuthModal: () => void
  closeAuthModal: () => void
  openAddressModal: () => void
  closeAddressModal: () => void
  setStep: (step: CheckoutStep) => void
  setPendingAddress: (address: AddressFormData | null) => void
  setLastSubmittedProfile: (profile: UserProfile | null) => void
  resetCheckoutFlow: () => void
}
