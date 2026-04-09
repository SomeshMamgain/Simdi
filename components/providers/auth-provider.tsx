'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession)
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession)

  useEffect(() => {
    if (!hasCheckedSession) {
      void checkSession()
    }
  }, [checkSession, hasCheckedSession])

  return <>{children}</>
}
