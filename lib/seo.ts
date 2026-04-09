import type { Metadata } from 'next'

const FALLBACK_SITE_URL = 'https://simdi.in'
const DEFAULT_OG_IMAGE = '/simdi.jpg'

export const SITE_NAME = 'SIMDI'
export const SITE_TAGLINE = 'Your Himalayan Friend'

export const defaultKeywords = [
  'SIMDI',
  'simdi.in',
  'Your Himalayan Friend',
  'Himalayan products online',
  'Pahadi products',
  'authentic Uttarakhand products',
  'organic Himalayan products',
  'women-led village products',
  'fair trade Himalayan products',
  'Uttarakhand ride booking',
  'parcel delivery Uttarakhand',
]

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim()
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  return new URL(withProtocol).toString().replace(/\/$/, '')
}

export function getSiteUrl() {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || FALLBACK_SITE_URL

  try {
    return normalizeSiteUrl(rawSiteUrl)
  } catch {
    return FALLBACK_SITE_URL
  }
}

export function getMetadataBase() {
  return new URL(`${getSiteUrl()}/`)
}

export function getCanonicalUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalizedPath, getMetadataBase()).toString()
}

export function getAbsoluteAssetUrl(path = DEFAULT_OG_IMAGE) {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (path.startsWith('//')) {
    return `https:${path}`
  }

  return getCanonicalUrl(path.startsWith('/') ? path : `/${path}`)
}

export function mergeKeywords(keywords: string[] = []) {
  const seen = new Set<string>()

  return [...defaultKeywords, ...keywords].filter((keyword) => {
    const normalized = keyword.trim().toLowerCase()

    if (!normalized || seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

type BuildMetadataInput = {
  title: string
  description: string
  path?: string
  keywords?: string[]
  index?: boolean
  follow?: boolean
  type?: 'website' | 'article'
  images?: string[]
  imageAlt?: string
  publishedTime?: string
  modifiedTime?: string
}

export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  index = true,
  follow = true,
  type = 'website',
  images = [DEFAULT_OG_IMAGE],
  imageAlt,
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const canonical = getCanonicalUrl(path)
  const resolvedImages = images.map((image) => ({
    url: getAbsoluteAssetUrl(image),
    alt: imageAlt ?? title,
  }))

  return {
    title,
    description,
    keywords: mergeKeywords(keywords),
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: SITE_NAME,
      locale: 'en_IN',
      images: resolvedImages,
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: resolvedImages.map((image) => image.url),
    },
  }
}
