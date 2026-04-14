'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { clearGoogleAuthIntent, readGoogleAuthIntent, trackEvent } from '@/lib/analytics/gtag'
import { useAuthStore } from '@/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession)
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const currentUser = useAuthStore((state) => state.currentUser)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!hasCheckedSession) {
      void checkSession()
    }
  }, [checkSession, hasCheckedSession])

  useEffect(() => {
    const authFlow = searchParams.get('authFlow')
    const authStatus = searchParams.get('authStatus')

    if (authFlow !== 'google' || authStatus !== 'success' || !isLoggedIn || !currentUser?.id) {
      return
    }

    const authIntent = readGoogleAuthIntent()
    clearGoogleAuthIntent()

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('authFlow')
    nextParams.delete('authStatus')

    const nextQuery = nextParams.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

    void (async () => {
      await trackEvent('google_auth_success', {
        category: 'CTA',
        priority: 'primary',
        page: 'auth_modal',
        auth_method: 'google',
        auth_mode: authIntent?.mode ?? 'signIn',
        source_page: authIntent?.sourcePage ?? pathname,
        user_id: currentUser.id,
      }, {
        awaitAck: true,
      })

      router.replace(nextUrl, { scroll: false })
    })()
  }, [currentUser?.id, isLoggedIn, pathname, router, searchParams])

  return <>{children}</>
}
