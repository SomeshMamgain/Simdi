import type { AuthApiResponse, LoginPayload, SignupPayload } from '@/types/auth'

async function parseAuthResponse(response: Response) {
  const payload = await response.json().catch(() => null) as AuthApiResponse | { message?: string } | null

  if (!response.ok) {
    const message = payload && 'message' in payload ? payload.message : undefined
    throw new Error(message ?? 'Authentication failed')
  }

  return payload as AuthApiResponse
}

export async function loginWithPassword(input: LoginPayload) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  return parseAuthResponse(response)
}

export async function signupWithPassword(input: SignupPayload) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  })

  return parseAuthResponse(response)
}

export async function fetchSessionState() {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null) as AuthApiResponse | { message?: string } | null

  if (!response.ok) {
    return {
      success: false,
      isLoggedIn: false,
      user: null,
      profile: null,
      avatarUrl: null,
    } satisfies AuthApiResponse
  }

  return payload as AuthApiResponse
}

export async function logoutFromSession() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(payload?.message ?? 'Unable to sign out')
  }
}
