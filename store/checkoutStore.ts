'use client'

import { create } from 'zustand'

import type { CheckoutState } from '@/types/checkout'

export const useCheckoutStore = create<CheckoutState>((set) => ({
  currentStep: 'idle',
  isAuthModalOpen: false,
  isAddressModalOpen: false,
  pendingAddress: null,
  lastSubmittedProfile: null,

  openAuthModal: () => set({ isAuthModalOpen: true, currentStep: 'auth' }),
  closeAuthModal: () => set({ isAuthModalOpen: false, currentStep: 'idle' }),
  openAddressModal: () => set({ isAddressModalOpen: true, currentStep: 'address' }),
  closeAddressModal: () => set({ isAddressModalOpen: false, currentStep: 'idle' }),
  setStep: (step) => set({ currentStep: step }),
  setPendingAddress: (address) => set({ pendingAddress: address }),
  setLastSubmittedProfile: (profile) => set({ lastSubmittedProfile: profile }),
  resetCheckoutFlow: () =>
    set({
      currentStep: 'idle',
      isAuthModalOpen: false,
      isAddressModalOpen: false,
      pendingAddress: null,
      lastSubmittedProfile: null,
    }),
}))
