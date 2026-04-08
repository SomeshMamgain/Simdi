import { AppwriteException } from 'appwrite'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email)
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
