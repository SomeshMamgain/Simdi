'use client'

// Client-safe authentication modal. Email/password uses the Appwrite web SDK, Google redirects to our backend OAuth route.
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import type { Models } from 'appwrite'
import { ID } from 'appwrite'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getAuthErrorMessage, isValidEmail } from '@/lib/auth-utils'
import { account } from '@/lib/appwrite'

type AuthTab = 'signIn' | 'signUp'
type AuthStatus = { type: 'error' | 'success'; message: string } | null
type PendingAction = 'signIn' | 'signUp' | 'forgotPassword' | 'googleSignIn' | 'googleSignUp'

interface AuthModalProps {
  open: boolean
  defaultTab?: AuthTab
  initialError?: string | null
  onClose: () => void
  onSuccess: (session: Models.Session) => void | Promise<void>
}

function GoogleMark() {
  return (
    <span className="auth-provider-mark" aria-hidden="true">
      <svg className="auth-provider-icon" viewBox="0 0 18 18" role="presentation">
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62Z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.31-1.58-5.02-3.7H1v2.33A9 9 0 0 0 9 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.98 10.72A5.41 5.41 0 0 1 3.7 9c0-.6.1-1.18.28-1.72V4.95H1A9 9 0 0 0 0 9c0 1.45.35 2.82 1 4.05l2.98-2.33Z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.45 3.44 1.33l2.58-2.58C13.46.89 11.42 0 9 0A9 9 0 0 0 1 4.95l2.98 2.33c.71-2.12 2.68-3.7 5.02-3.7Z"
        />
      </svg>
    </span>
  )
}

function getPasswordValidationError(password: string) {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }

  return null
}

export function AuthModal({
  open,
  defaultTab = 'signIn',
  initialError = null,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab)
  const [signInForm, setSignInForm] = useState({ email: '', password: '' })
  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [signInStatus, setSignInStatus] = useState<AuthStatus>(null)
  const [signUpStatus, setSignUpStatus] = useState<AuthStatus>(null)

  const isBusy = pendingAction !== null

  useEffect(() => {
    if (!open) {
      return
    }

    setActiveTab(defaultTab)
    setPendingAction(null)

    if (defaultTab === 'signUp') {
      setSignInStatus(null)
      setSignUpStatus(initialError ? { type: 'error', message: initialError } : null)
      return
    }

    setSignUpStatus(null)
    setSignInStatus(initialError ? { type: 'error', message: initialError } : null)
  }, [defaultTab, initialError, open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isBusy) {
      onClose()
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as AuthTab)
    setSignInStatus(null)
    setSignUpStatus(null)
  }

  const handleSignInChange = (field: 'email' | 'password', value: string) => {
    setSignInForm((current) => ({ ...current, [field]: value }))
    setSignInStatus(null)
  }

  const handleSignUpChange = (field: 'firstName' | 'lastName' | 'email' | 'password', value: string) => {
    setSignUpForm((current) => ({ ...current, [field]: value }))
    setSignUpStatus(null)
  }

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = signInForm.email.trim()
    const passwordError = getPasswordValidationError(signInForm.password)

    if (!email || !signInForm.password) {
      setSignInStatus({ type: 'error', message: 'Email and password are required.' })
      return
    }

    if (!isValidEmail(email)) {
      setSignInStatus({ type: 'error', message: 'Enter a valid email address.' })
      return
    }

    if (passwordError) {
      setSignInStatus({ type: 'error', message: passwordError })
      return
    }

    setPendingAction('signIn')

    try {
      const session = await account.createEmailPasswordSession(email, signInForm.password)
      await Promise.resolve(onSuccess(session))
      onClose()
    } catch (error) {
      setSignInStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setPendingAction(null)
    }
  }

  const handleForgotPassword = async () => {
    const email = signInForm.email.trim()

    if (!email) {
      setSignInStatus({ type: 'error', message: 'Enter your email address to recover your password.' })
      return
    }

    if (!isValidEmail(email)) {
      setSignInStatus({ type: 'error', message: 'Enter a valid email address.' })
      return
    }

    setPendingAction('forgotPassword')

    try {
      const recoveryUrl = new URL('/reset-password', window.location.origin).toString()
      await account.createRecovery(email, recoveryUrl)
      setSignInStatus({
        type: 'success',
        message: 'Recovery email sent. Check your inbox for the password reset link.',
      })
    } catch (error) {
      setSignInStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setPendingAction(null)
    }
  }

  const handleGoogleAuth = (tab: AuthTab) => {
    const setStatus = tab === 'signIn' ? setSignInStatus : setSignUpStatus

    setStatus(null)
    setPendingAction(tab === 'signIn' ? 'googleSignIn' : 'googleSignUp')

    try {
      window.location.href = '/api/auth/google'
    } catch (error) {
      setPendingAction(null)
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    }
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const firstName = signUpForm.firstName.trim()
    const lastName = signUpForm.lastName.trim()
    const email = signUpForm.email.trim()
    const passwordError = getPasswordValidationError(signUpForm.password)

    if (!firstName || !lastName || !email || !signUpForm.password) {
      setSignUpStatus({ type: 'error', message: 'First name, last name, email, and password are required.' })
      return
    }

    if (!isValidEmail(email)) {
      setSignUpStatus({ type: 'error', message: 'Enter a valid email address.' })
      return
    }

    if (passwordError) {
      setSignUpStatus({ type: 'error', message: passwordError })
      return
    }

    setPendingAction('signUp')

    try {
      const name = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim()

      await account.create(ID.unique(), email, signUpForm.password, name)

      const session = await account.createEmailPasswordSession(email, signUpForm.password)
      await Promise.resolve(onSuccess(session))
      onClose()
    } catch (error) {
      setSignUpStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="auth-modal-overlay" />
        <Dialog.Content
          className="auth-modal-content"
          onEscapeKeyDown={(event) => {
            if (isBusy) {
              event.preventDefault()
            }
          }}
          onPointerDownOutside={(event) => {
            if (isBusy) {
              event.preventDefault()
            }
          }}
        >
          <div className="auth-modal-intro">
            <p className="auth-modal-eyebrow">SIMDI ACCOUNT</p>
            <Dialog.Title className="auth-modal-title">Welcome to your pahadi market</Dialog.Title>
            <Dialog.Description className="auth-modal-description">
              Sign in to continue faster, or create an account to keep your SIMDI orders and details in one place.
            </Dialog.Description>
          </div>

          <button
            type="button"
            className="auth-modal-close"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close authentication modal"
          >
            <X size={20} />
          </button>

          <Tabs.Root value={activeTab} onValueChange={handleTabChange}>
            <Tabs.List className="auth-tabs-list" aria-label="Authentication options">
              <Tabs.Trigger className="auth-tab-trigger" value="signIn">
                Sign in
              </Tabs.Trigger>
              <Tabs.Trigger className="auth-tab-trigger" value="signUp">
                Sign up
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="signIn" className="auth-tab-panel">
              <form className="auth-form" onSubmit={handleSignIn}>
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    className="auth-input"
                    type="email"
                    value={signInForm.email}
                    onChange={(event) => handleSignInChange('email', event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isBusy}
                  />
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <input
                    className="auth-input"
                    type="password"
                    value={signInForm.password}
                    onChange={(event) => handleSignInChange('password', event.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="current-password"
                    disabled={isBusy}
                  />
                </label>

                <div className="auth-link-row">
                  <button
                    type="button"
                    className="auth-inline-link"
                    onClick={handleForgotPassword}
                    disabled={isBusy}
                  >
                    {pendingAction === 'forgotPassword' ? 'Sending recovery email...' : 'Forgot password?'}
                  </button>
                </div>

                <button className="auth-primary-button" type="submit" disabled={isBusy}>
                  {pendingAction === 'signIn' ? 'Signing in...' : 'Sign in'}
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <button
                  className="auth-secondary-button"
                  type="button"
                  onClick={() => handleGoogleAuth('signIn')}
                  disabled={isBusy}
                  aria-label="Continue with Google"
                >
                  <GoogleMark />
                  <span className="auth-provider-label">
                    {pendingAction === 'googleSignIn' ? 'Redirecting to Google...' : 'Continue with Google'}
                  </span>
                </button>

                {signInStatus ? (
                  <div className={`auth-status auth-status--${signInStatus.type}`}>{signInStatus.message}</div>
                ) : null}
              </form>
            </Tabs.Content>

            <Tabs.Content value="signUp" className="auth-tab-panel">
              <form className="auth-form" onSubmit={handleSignUp}>
                <div className="auth-field-grid">
                  <label className="auth-field">
                    <span>First name</span>
                    <input
                      className="auth-input"
                      type="text"
                      value={signUpForm.firstName}
                      onChange={(event) => handleSignUpChange('firstName', event.target.value)}
                      placeholder="Aarohi"
                      autoComplete="given-name"
                      disabled={isBusy}
                    />
                  </label>

                  <label className="auth-field">
                    <span>Last name</span>
                    <input
                      className="auth-input"
                      type="text"
                      value={signUpForm.lastName}
                      onChange={(event) => handleSignUpChange('lastName', event.target.value)}
                      placeholder="Rawat"
                      autoComplete="family-name"
                      disabled={isBusy}
                    />
                  </label>
                </div>

                <label className="auth-field">
                  <span>Email</span>
                  <input
                    className="auth-input"
                    type="email"
                    value={signUpForm.email}
                    onChange={(event) => handleSignUpChange('email', event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={isBusy}
                  />
                </label>

                <label className="auth-field">
                  <span>Password</span>
                  <input
                    className="auth-input"
                    type="password"
                    value={signUpForm.password}
                    onChange={(event) => handleSignUpChange('password', event.target.value)}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    disabled={isBusy}
                  />
                </label>

                <button className="auth-primary-button" type="submit" disabled={isBusy}>
                  {pendingAction === 'signUp' ? 'Creating account...' : 'Create account'}
                </button>

                <div className="auth-divider">
                  <span>or</span>
                </div>

                <button
                  className="auth-secondary-button"
                  type="button"
                  onClick={() => handleGoogleAuth('signUp')}
                  disabled={isBusy}
                  aria-label="Continue with Google"
                >
                  <GoogleMark />
                  <span className="auth-provider-label">
                    {pendingAction === 'googleSignUp' ? 'Redirecting to Google...' : 'Google'}
                  </span>
                </button>

                {signUpStatus ? (
                  <div className={`auth-status auth-status--${signUpStatus.type}`}>{signUpStatus.message}</div>
                ) : null}
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
