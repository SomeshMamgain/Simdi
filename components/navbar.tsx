'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Models } from 'appwrite'
import { LogOut, Menu, UserRound, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { getDisplayName } from '@/lib/auth-utils'
import { account } from '@/lib/appwrite'

import { AuthModal } from './AuthModal'
import { CartIcon } from './navigation/CartIcon'

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [preferredAuthTab, setPreferredAuthTab] = useState<'signIn' | 'signUp'>('signIn')
  const [authModalError, setAuthModalError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<Models.Session | null>(null)
  const [accountLabel, setAccountLabel] = useState('Account')
  const [accountEmail, setAccountEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [hasAvatarError, setHasAvatarError] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/shop' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Our Roots', href: '/our-roots' },
  ]

  useEffect(() => {
    let isMounted = true

    async function loadCurrentSession() {
      try {
        const backendResponse = await fetch('/api/auth/session', {
          credentials: 'include',
          cache: 'no-store',
        })

        if (backendResponse.ok) {
          const { session, user, avatarUrl } = await backendResponse.json() as {
            session: Models.Session
            user: { name?: string | null; email?: string | null }
            avatarUrl?: string | null
          }

          if (!isMounted) {
            return
          }
          setCurrentSession(session)
          setAccountLabel(getDisplayName(user.name, user.email))
          setAccountEmail(user.email ?? '')
          setAvatarUrl(avatarUrl ?? null)
          return
        }

        const [session, user] = await Promise.all([account.getSession('current'), account.get()])

        if (!isMounted) {
          return
        }

        setCurrentSession(session)
        setAccountLabel(getDisplayName(user.name, user.email))
        setAccountEmail(user.email ?? '')
        setAvatarUrl(null)
      } catch {
        if (!isMounted) {
          return
        }

        setCurrentSession(null)
        setAccountLabel('Account')
        setAccountEmail('')
        setAvatarUrl(null)
      }
    }

    void loadCurrentSession()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setHasAvatarError(false)
  }, [avatarUrl])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const nextParams = new URLSearchParams(window.location.search)

    if (nextParams.get('authError') !== 'google_oauth') {
      return
    }

    const nextTab = nextParams.get('authMode') === 'signUp' ? 'signUp' : 'signIn'
    const nextMessage = 'Google authentication could not be completed. Please try again.'

    nextParams.delete('authError')
    nextParams.delete('authMode')

    setPreferredAuthTab(nextTab)
    setAuthModalError(nextMessage)
    setIsAuthModalOpen(true)

    const nextQuery = nextParams.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

    router.replace(nextUrl, { scroll: false })
  }, [pathname, router])

  const handleOpenAuthModal = () => {
    setPreferredAuthTab('signIn')
    setAuthModalError(null)
    setIsAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setAuthModalError(null)
    setIsAuthModalOpen(false)
  }

  const handleAuthSuccess = async (session: Models.Session) => {
    setCurrentSession(session)
    setIsAccountMenuOpen(false)

    try {
      const user = await account.get()
      setAccountLabel(getDisplayName(user.name, user.email))
      setAccountEmail(user.email ?? '')
      setAvatarUrl(null)
    } catch {
      setAccountLabel('Account')
      setAccountEmail('')
      setAvatarUrl(null)
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setIsAccountMenuOpen(false)

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignore backend logout failures and continue clearing local session state.
    }

    try {
      await account.deleteSession('current')
    } catch {
      // Clear the local auth state even if the session was already missing.
    } finally {
      setCurrentSession(null)
      setAccountLabel('Account')
      setAccountEmail('')
      setAvatarUrl(null)
      setIsSigningOut(false)
    }
  }

  const shouldShowAvatarImage = Boolean(avatarUrl && !hasAvatarError)

  return (
    <>
      <header className="navbar">
        {/* Mobile Menu Trigger */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Brand */}
        <Link href="/" className="brand-container">
          <Image src="/logo.jpeg" alt="SIMDI Logo" width={40} height={40} style={{ borderRadius: '25px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-text">SIMDI</span>
            <span className="tagline">
              BE PAHADI • BUY PAHADI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentSession ? (
            <div className="auth-nav-group" ref={accountMenuRef}>
              <button
                className={`auth-avatar-trigger${isAccountMenuOpen ? ' is-open' : ''}`}
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                aria-label={`Signed in as ${accountLabel}`}
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <span className="auth-avatar-shell">
                  {shouldShowAvatarImage ? (
                    <img
                      src={avatarUrl ?? ''}
                      alt={`${accountLabel} profile`}
                      className="auth-avatar-image"
                      referrerPolicy="no-referrer"
                      onError={() => setHasAvatarError(true)}
                    />
                  ) : (
                    <UserRound size={18} />
                  )}
                </span>
                <span className="auth-avatar-label">{accountLabel}</span>
              </button>

              <div
                className={`auth-account-menu${isAccountMenuOpen ? ' is-open' : ''}`}
                role="menu"
                aria-hidden={!isAccountMenuOpen}
              >
                <div className="auth-account-summary">
                  <span className="auth-avatar-shell auth-avatar-shell--menu">
                    {shouldShowAvatarImage ? (
                      <img
                        src={avatarUrl ?? ''}
                        alt={`${accountLabel} profile`}
                        className="auth-avatar-image"
                        referrerPolicy="no-referrer"
                        onError={() => setHasAvatarError(true)}
                      />
                    ) : (
                      <UserRound size={18} />
                    )}
                  </span>
                  <div className="auth-account-copy">
                    <strong>{accountLabel}</strong>
                    {accountEmail ? <span>{accountEmail}</span> : null}
                  </div>
                </div>

                <button className="auth-account-action" onClick={handleSignOut} disabled={isSigningOut} role="menuitem">
                  <LogOut size={18} />
                  <span>{isSigningOut ? 'Signing out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          ) : (
            <button className="auth-trigger" onClick={handleOpenAuthModal}>
              <UserRound size={18} />
              <span>Sign in</span>
            </button>
          )}
          <CartIcon />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay${isMobileMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={32} color="#1E2D24" />
        </button>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            {label}
          </Link>
        ))}
      </div>

      <AuthModal
        open={isAuthModalOpen}
        defaultTab={preferredAuthTab}
        initialError={authModalError}
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </>
  )
}
