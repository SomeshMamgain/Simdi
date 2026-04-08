'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { getAuthErrorMessage } from '@/lib/auth-utils'
import { account } from '@/lib/appwrite'

type RecoveryStatus = { type: 'error' | 'success'; message: string } | null

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')?.trim() ?? ''
  const secret = searchParams.get('secret')?.trim() ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<RecoveryStatus>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userId || !secret) {
      setStatus({
        type: 'error',
        message: 'This recovery link is incomplete. Request a new password reset email and try again.',
      })
      return
    }

    if (!password || !confirmPassword) {
      setStatus({ type: 'error', message: 'Enter and confirm your new password.' })
      return
    }

    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters long.' })
      return
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setIsSubmitting(true)

    try {
      await account.updateRecovery(userId, secret, password)
      setStatus({
        type: 'success',
        message: 'Your password has been updated. Return to the shop and sign in with your new password.',
      })
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setStatus({ type: 'error', message: getAuthErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="recovery-page">
      <div className="recovery-card">
        <p className="recovery-eyebrow">PASSWORD RESET</p>
        <h1 className="recovery-title">Choose a new password</h1>
        <p className="recovery-description">
          Set a fresh password for your SIMDI account and get back to checkout without losing your place.
        </p>

        {!userId || !secret ? (
          <div className="auth-status auth-status--error">
            This reset link is missing the required Appwrite recovery details.
          </div>
        ) : null}

        {status ? <div className={`auth-status auth-status--${status.type}`}>{status.message}</div> : null}

        <form className="recovery-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>New password</span>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setStatus(null)
              }}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </label>

          <label className="auth-field">
            <span>Confirm password</span>
            <input
              className="auth-input"
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setStatus(null)
              }}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
          </label>

          <button className="auth-primary-button" type="submit" disabled={isSubmitting || !userId || !secret}>
            {isSubmitting ? 'Updating password...' : 'Update password'}
          </button>
        </form>

        <div className="recovery-footer">
          <Link href="/shop" className="recovery-link">
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}