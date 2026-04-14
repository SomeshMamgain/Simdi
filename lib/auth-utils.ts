import { AppwriteException } from 'appwrite'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const STRONG_PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email)
}

export function getStrongPasswordValidationError(password: string) {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.'
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.'
  }

  if (!/\d/.test(password)) {
    return 'Password must include at least one number.'
  }

  return null
}

export function getPasswordStrength(password: string) {
  if (!password) {
    return 'weak' as const
  }

  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
  ].filter(Boolean).length

  if (checks <= 2) {
    return 'weak' as const
  }

  if (checks === 3) {
    return 'fair' as const
  }

  return STRONG_PASSWORD_PATTERN.test(password) ? 'strong' as const : 'fair' as const
}

export function getAuthErrorMessage(error: unknown) {
  if (error instanceof AppwriteException) {
    switch (error.type) {
      case 'user_invalid_credentials':
        return 'The email or password you entered is incorrect.'
      case 'user_already_exists':
        return 'An account with this email already exists.'
      case 'general_argument_invalid':
        return 'Please review your details and try again.'
      default:
        return error.message || 'Something went wrong. Please try again.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export function getDisplayName(name?: string | null, email?: string | null) {
  const fallback = email?.split('@')[0] ?? 'Account'
  const value = name?.trim() || fallback

  return value.split(/\s+/)[0] ?? 'Account'
}

export function getUserInitials(name?: string | null, email?: string | null) {
  const normalizedName = name?.trim()

  if (normalizedName) {
    const words = normalizedName.split(/\s+/).filter(Boolean)
    const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('')

    if (initials) {
      return initials
    }
  }

  const emailPrefix = email?.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '') ?? ''

  if (emailPrefix) {
    return emailPrefix.slice(0, 2).toUpperCase()
  }

  return 'A'
}
