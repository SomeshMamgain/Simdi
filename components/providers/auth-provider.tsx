'use client'

import { useEffect } from 'react'

import { clearGoogleAuthIntent, readGoogleAuthIntent, trackEvent } from '@/lib/analytics/gtag'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession)
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const currentUser = useAuthStore((state) => state.currentUser)

  useEffect(() => {
    if (!hasCheckedSession) {
      void checkSession()
    }
  }, [checkSession, hasCheckedSession])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const currentUrl = new URL(window.location.href)
    const authFlow = currentUrl.searchParams.get('authFlow')
    const authStatus = currentUrl.searchParams.get('authStatus')

    if (authFlow !== 'google' || authStatus !== 'success' || !isLoggedIn || !currentUser?.id) {
      return
    }

    const authIntent = readGoogleAuthIntent()
    clearGoogleAuthIntent()

    void (async () => {
      await trackEvent('google_auth_success', {
        category: 'CTA',
        priority: 'primary',
        page: 'auth_modal',
        auth_method: 'google',
        auth_mode: authIntent?.mode ?? 'signIn',
        source_page: authIntent?.sourcePage ?? currentUrl.pathname,
        user_id: currentUser.id,
      }, {
        awaitAck: true,
      })

      currentUrl.searchParams.delete('authFlow')
      currentUrl.searchParams.delete('authStatus')
      window.history.replaceState({}, '', `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`)
    })()
  }, [currentUser?.id, isLoggedIn])

  return <>{children}</>
}
