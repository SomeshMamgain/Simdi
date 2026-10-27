'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './diwali-popup.module.css'

const STORAGE_KEY = 'simdiDiwaliPopupDismissed'
const PROMO_CODE = 'DIWALI20'
const CTA_URL = '/products'
const PROMO_READY = true

const BAL_MITHAI_IMAGE = 'https://simdi.in/product_images/bal_mithai/bal_mithai.webp'
const ARSA_IMAGE = 'https://simdi.in/product_images/arsa/arsa.webp'

export default function DiwaliPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const hasDismissed = window.sessionStorage.getItem(STORAGE_KEY) === 'true'
    if (hasDismissed) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismissPopup()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!PROMO_READY) {
      console.warn('SIMDI Diwali promo is not active yet. Add the DIWALI20 promo in the checkout system before launch.')
    }
  }, [])

  const dismissPopup = () => {
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(STORAGE_KEY, 'true')
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = PROMO_CODE
      fallback.setAttribute('readonly', 'true')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      document.body.removeChild(fallback)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          dismissPopup()
        }
      }}
      aria-hidden={!isOpen}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="simdi-diwali-popup-title"
        aria-describedby="simdi-diwali-popup-description"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={dismissPopup}
          aria-label="Close festive offer"
        >
          ×
        </button>

        <div className={styles.content}>
          <div className={styles.visualPanel} aria-hidden="true">
            <div className={styles.lightGlow} />
            <div className={styles.productStack}>
              <img
                src={BAL_MITHAI_IMAGE}
                alt="Bal Mithai - traditional Pahadi sweet"
                className={styles.productImage}
              />
              <img
                src={ARSA_IMAGE}
                alt="Arsa - traditional Himalayan sweet"
                className={styles.productImageSecondary}
              />
            </div>
            <div className={styles.productBadge}>Pahadi Gift Box</div>
          </div>

          <div className={styles.copyPanel}>
            <p className={styles.kicker}>🪔 SHUBH DEEPAVALI FROM SIMDI</p>
            <h2 id="simdi-diwali-popup-title" className={styles.title}>
              ✨ Make This Diwali Sweeter with Pahadi Love!
            </h2>

            <p id="simdi-diwali-popup-description" className={styles.description}>
              This Diwali, treat your loved ones to the authentic taste of the Himalayas. From our beloved Bal Mithai to traditional Arsa, share the warmth, sweetness, and traditions of Uttarakhand with every bite.
            </p>

            <div className={styles.offerBox}>
              <p className={styles.offerLabel}>🎁 A SPECIAL DIWALI GIFT FOR YOU</p>

              <div className={styles.promoRow}>
                <span className={styles.promoCode}>{PROMO_CODE}</span>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={handleCopyCode}
                  aria-live="polite"
                >
                  {copied ? 'Coupon copied!' : 'Copy Code'}
                </button>
              </div>

              <p className={styles.discountText}>GET 20% OFF YOUR ORDER</p>
            </div>

            <div className={styles.ctaWrap}>
              <Link href={CTA_URL} className={styles.primaryCta} onClick={dismissPopup}>
                Celebrate with 20% OFF →
              </Link>
            </div>

            <p className={styles.footerNote}>A little Pahadi sweetness goes a long way. ❤️</p>
          </div>
        </div>
      </div>
    </div>
  )
}
