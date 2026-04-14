'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startTransition, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'

import { type AnalyticsParams, trackEventBeforeNavigation } from '@/lib/analytics/gtag'

interface TrackedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children: ReactNode
  eventName: string
  eventParams?: AnalyticsParams
  href: string
  prefetch?: boolean | null
  replace?: boolean
  scroll?: boolean
  debounceKey?: string
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

export function TrackedLink({
  children,
  eventName,
  eventParams,
  href,
  onClick,
  replace = false,
  scroll = true,
  debounceKey,
  ...props
}: TrackedLinkProps) {
  const router = useRouter()

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented || isModifiedEvent(event) || props.target === '_blank') {
      return
    }

    event.preventDefault()

    await trackEventBeforeNavigation({
      eventName,
      debounceKey: debounceKey ?? `${eventName}:${href}`,
      params: {
        destination_path: href,
        ...eventParams,
      },
      navigate: () => {
        startTransition(() => {
          if (replace) {
            router.replace(href, { scroll })
            return
          }

          router.push(href, { scroll })
        })
      },
    })
  }

  return (
    <Link href={href} onClick={(event) => void handleClick(event)} replace={replace} scroll={scroll} {...props}>
      {children}
    </Link>
  )
}
