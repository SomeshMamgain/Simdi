'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { fetchSessionState, loginWithPassword, logoutFromSession, signupWithPassword } from '@/lib/services/auth-service'
import { updateUserProfile as updateUserProfileRequest } from '@/lib/services/user-service'
import type { AddressFormData } from '@/types/address'
import type { AuthApiResponse, AuthUser, LoginPayload, SignupPayload, UserProfile } from '@/types/auth'

interface AuthStore {
  isLoggedIn: boolean
  currentUser: AuthUser | null
  profile: UserProfile | null
  avatarUrl: string | null
  isLoading: boolean
  error: string | null
  hasHydrated: boolean
  hasCheckedSession: boolean
  setHydrated: (value: boolean) => void
  clearError: () => void
  login: (input: LoginPayload) => Promise<AuthApiResponse>
  signup: (input: SignupPayload) => Promise<AuthApiResponse>
  logout: () => Promise<void>
  checkSession: () => Promise<AuthApiResponse>
  updateUserProfile: (input: { fullAddress: AddressFormData; saveForFutureOrders: boolean }) => Promise<AuthApiResponse>
}

function applyAuthPayload(set: (partial: Partial<AuthStore>) => void, payload: AuthApiResponse) {
  set({
    isLoggedIn: payload.isLoggedIn,
    currentUser: payload.user,
    profile: payload.profile,
    avatarUrl: payload.avatarUrl ?? null,
    error: null,
    hasCheckedSession: true,
  })
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      currentUser: null,
      profile: null,
      avatarUrl: null,
      isLoading: false,
      error: null,
      hasHydrated: false,
      hasCheckedSession: false,

      setHydrated: (value) => set({ hasHydrated: value }),

      clearError: () => set({ error: null }),

      login: async (input) => {
        set({ isLoading: true, error: null })

        try {
          const payload = await loginWithPassword(input)
          applyAuthPayload(set, payload)
          return payload
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (input) => {
        set({ isLoading: true, error: null })

        try {
          const payload = await signupWithPassword(input)
          applyAuthPayload(set, payload)
          return payload
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Signup failed'
          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })

        try {
          await logoutFromSession()
          set({
            isLoggedIn: false,
            currentUser: null,
            profile: null,
            avatarUrl: null,
            hasCheckedSession: true,
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Logout failed'
          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      checkSession: async () => {
        set({ isLoading: true })

        try {
          const payload = await fetchSessionState()
          applyAuthPayload(set, payload)
          return payload
        } catch (error) {
          set({
            isLoggedIn: false,
            currentUser: null,
            profile: null,
            avatarUrl: null,
            error: error instanceof Error ? error.message : 'Unable to verify your session',
            hasCheckedSession: true,
          })

          return {
            success: false,
            isLoggedIn: false,
            user: null,
            profile: null,
            avatarUrl: null,
          }
        } finally {
          set({ isLoading: false })
        }
      },

      updateUserProfile: async (input) => {
        set({ isLoading: true, error: null })

        try {
          const payload = await updateUserProfileRequest(input)
          applyAuthPayload(set, payload)
          return payload
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to save your profile'
          set({ error: message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'simdi-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser,
        profile: state.profile,
        avatarUrl: state.avatarUrl,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
