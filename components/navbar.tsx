'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Models } from 'appwrite'
import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getDisplayName } from '@/lib/auth-utils'
import { account } from '@/lib/appwrite'
import { useCartStore } from '@/store/cartStore'

import { AuthModal } from './AuthModal'
import { CartDrawer } from './CartDrawer'

export const Navbar = () => {
  const totalItems = useCartStore((state) => state.totalItems())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [preferredAuthTab, setPreferredAuthTab] = useState<'signIn' | 'signUp'>('signIn')
  const [authModalError, setAuthModalError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<Models.Session | null>(null)
  const [accountLabel, setAccountLabel] = useState('Account')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

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
          const { session, user } = await backendResponse.json() as {
            session: Models.Session
            user: { name?: string | null; email?: string | null }
          }

          if (!isMounted) {
            return
          }

          setCurrentSession(session)
          setAccountLabel(getDisplayName(user.name, user.email))
          return
        }

        const [session, user] = await Promise.all([account.getSession('current'), account.get()])

        if (!isMounted) {
          return
        }

        setCurrentSession(session)
        setAccountLabel(getDisplayName(user.name, user.email))
      } catch {
        if (!isMounted) {
          return
        }

        setCurrentSession(null)
        setAccountLabel('Account')
      }
    }

    void loadCurrentSession()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (searchParams.get('authError') !== 'google_oauth') {
      return
    }

    const nextTab = searchParams.get('authMode') === 'signUp' ? 'signUp' : 'signIn'
    const nextParams = new URLSearchParams(searchParams.toString())
    const nextMessage = 'Google authentication could not be completed. Please try again.'

    nextParams.delete('authError')
    nextParams.delete('authMode')

    setPreferredAuthTab(nextTab)
    setAuthModalError(nextMessage)
    setIsAuthModalOpen(true)

    const nextQuery = nextParams.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname

    router.replace(nextUrl, { scroll: false })
  }, [pathname, router, searchParams])

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

    try {
      const user = await account.get()
      setAccountLabel(getDisplayName(user.name, user.email))
    } catch {
      setAccountLabel('Account')
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)

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
      setIsSigningOut(false)
    }
  }

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
            <div className="auth-nav-group">
              <div className="auth-chip" aria-label={`Signed in as ${accountLabel}`}>
                <UserRound size={18} />
                <span>{accountLabel}</span>
              </div>
              <button className="auth-logout" onClick={handleSignOut} disabled={isSigningOut}>
                <LogOut size={18} />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
              </button>
            </div>
          ) : (
            <button className="auth-trigger" onClick={handleOpenAuthModal}>
              <UserRound size={18} />
              <span>Sign in</span>
            </button>
          )}
          <button className="icon-btn"><Search size={22} /></button>
          <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative' }} className="icon-btn">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </button>
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

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
