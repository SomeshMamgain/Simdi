'use client'

export type AnalyticsPriority = 'primary' | 'secondary' | 'tertiary'
export type AnalyticsPrimitive = string | number | boolean | null | undefined
export type AnalyticsParams = Record<string, AnalyticsPrimitive>

interface GtagEventOptions {
  event_callback?: () => void
  event_timeout?: number
  transport_type?: 'beacon' | 'xhr' | 'image'
  [key: string]: unknown
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: 'event', eventName: string, options?: GtagEventOptions) => void
  }
}

const DEFAULT_DEBOUNCE_MS = 900
const DEFAULT_TIMEOUT_MS = 1200
const GOOGLE_AUTH_INTENT_KEY = 'simdi_google_auth_intent'
const recentEvents = new Map<string, number>()

export interface GoogleAuthIntent {
  mode: 'signIn' | 'signUp'
  sourcePage: string
  startedAt: number
}

interface TrackEventOptions {
  debounceKey?: string
  debounceMs?: number
  awaitAck?: boolean
  timeoutMs?: number
}

interface TrackBeforeNavigationOptions extends TrackEventOptions {
  eventName: string
  params?: AnalyticsParams
  navigate: () => void
}

function compactParams(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined))
}

function buildEventKey(eventName: string, params: AnalyticsParams, explicitKey?: string) {
  if (explicitKey) {
    return explicitKey
  }

  const stableParams = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .sort(([left], [right]) => left.localeCompare(right))

  return `${eventName}:${JSON.stringify(stableParams)}`
}

function isDuplicateEvent(eventKey: string, debounceMs: number) {
  const now = Date.now()
  const previousTs = recentEvents.get(eventKey)

  recentEvents.set(eventKey, now)

  if (!previousTs) {
    return false
  }

  return now - previousTs < debounceMs
}

function getCurrentPagePath() {
  if (typeof window === 'undefined') {
    return '/'
  }

  return window.location.pathname || '/'
}

function getCurrentPageLocation() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.href
}

export function getPageType(pagePath = getCurrentPagePath()) {
  if (pagePath === '/') {
    return 'homepage'
  }

  if (pagePath === '/products') {
    return 'product_listing'
  }

  if (pagePath.startsWith('/products/')) {
    return 'product_detail'
  }

  if (pagePath === '/cart') {
    return 'cart'
  }

  if (pagePath.startsWith('/order-confirmation/')) {
    return 'order_success'
  }

  if (pagePath.startsWith('/orders/')) {
    return 'order_detail'
  }

  if (pagePath === '/orders') {
    return 'order_history'
  }

  return 'other'
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}, options: TrackEventOptions = {}) {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS
  const eventParams = compactParams({
    event_category: params.category ?? 'CTA',
    cta_priority: params.priority,
    source_page: params.source_page ?? getCurrentPagePath(),
    page_path: params.page_path ?? getCurrentPagePath(),
    page_location: params.page_location ?? getCurrentPageLocation(),
    page_type: params.page_type ?? getPageType(typeof params.page_path === 'string' ? params.page_path : undefined),
    ...params,
  }) as AnalyticsParams
  const eventKey = buildEventKey(eventName, eventParams, options.debounceKey)

  if (isDuplicateEvent(eventKey, debounceMs)) {
    return Promise.resolve(false)
  }

  return new Promise<boolean>((resolve) => {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
    let settled = false

    const finish = () => {
      if (settled) {
        return
      }

      settled = true
      resolve(true)
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...eventParams,
        transport_type: 'beacon',
        event_timeout: timeoutMs,
        event_callback: finish,
      })

      if (!options.awaitAck) {
        finish()
      }

      window.setTimeout(finish, timeoutMs)
      return
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
      })
    }

    finish()
  })
}

export async function trackEventBeforeNavigation({
  eventName,
  params = {},
  navigate,
  ...options
}: TrackBeforeNavigationOptions) {
  await trackEvent(eventName, params, {
    ...options,
    awaitAck: true,
  })

  navigate()
}

export function storeGoogleAuthIntent(intent: GoogleAuthIntent) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(GOOGLE_AUTH_INTENT_KEY, JSON.stringify(intent))
}

export function readGoogleAuthIntent() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.sessionStorage.getItem(GOOGLE_AUTH_INTENT_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as GoogleAuthIntent

    if (!parsedValue?.sourcePage || !parsedValue?.startedAt || !parsedValue?.mode) {
      return null
    }

    return parsedValue
  } catch {
    return null
  }
}

export function clearGoogleAuthIntent() {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(GOOGLE_AUTH_INTENT_KEY)
}
