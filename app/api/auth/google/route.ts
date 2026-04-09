// Server-only route handler for starting the Google OAuth flow from our own domain.
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function getGoogleAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim()

  if (!clientId) {
    throw new Error('Missing GOOGLE_CLIENT_ID')
  }

  return {
    clientId,
    configuredBaseUrl,
  }
}

export async function GET(request: NextRequest) {
  const { clientId, configuredBaseUrl } = getGoogleAuthConfig()
  const baseUrl = configuredBaseUrl?.replace(/\/$/, '') || request.nextUrl.origin
  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  googleUrl.searchParams.set('client_id', clientId)
  googleUrl.searchParams.set('redirect_uri', `${baseUrl}/api/auth/google/callback`)
  googleUrl.searchParams.set('response_type', 'code')
  googleUrl.searchParams.set('scope', 'openid email profile')

  return NextResponse.redirect(googleUrl)
}
