'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import styles from './winter-baskets-popup.module.css'

const STORAGE_KEY = 'simdiWinterBasketsPopupDismissed'

const baskets = [
  { name: 'Winter Essentials', price: '₹1,899', includes: '7 pantry essentials', href: '/products/pahadi-winter-essentials', image: '/product_images/winter_essentials/simdi_essentials.webp' },
  { name: 'Winter Nourishment', price: '₹2,899', includes: '10 winter staples', href: '/products/himalayan-winter-nourishment', image: '/product_images/simdi_nourishment/simdi_nourishment.webp' },
  { name: 'Heritage Luxury Hamper', price: '₹4,499', includes: '12 Himalayan treasures', href: '/products/pahadi-heritage-luxury-hamper', image: '/product_images/simdi_luxury/simdi_luxury.webp' },
]

export default function WinterBasketsPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  const dismissPopup = () => {
    setIsOpen(false)
    window.sessionStorage.setItem(STORAGE_KEY, 'true')
  }

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY) === 'true') return

    const timer = window.setTimeout(() => setIsOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && dismissPopup()

    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={(event) => event.target === event.currentTarget && dismissPopup()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="winter-baskets-title">
        <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={dismissPopup} aria-label="Close Winter Collection">
          ×
        </button>
        <div className={styles.content}>
          <div className={styles.copyPanel}>
            <p className={styles.kicker}>SIMDI Winter Collection</p>
            <h2 id="winter-baskets-title">Bring the Warmth of the Himalayas Home</h2>
            <p>Three thoughtfully curated baskets of mountain grains, pulses, honey, ghee and authentic Pahadi flavours—made for winter meals and meaningful gifting.</p>
            <Link href="/products" className={styles.primaryCta} onClick={dismissPopup}>Explore Winter Baskets</Link>
            {/* <button type="button" className={styles.secondaryCta} onClick={dismissPopup}>Continue browsing</button> */}
          </div>
          <div className={styles.baskets} aria-label="Winter Basket collection">
            <div className={styles.collectionNote}>
              <p>Winter, thoughtfully packed</p>
              <h3>Choose your taste of the Himalayas.</h3>
              <span>7 essentials · 10 pantry staples · 12 gifting treasures</span>
            </div>
            {baskets.map((basket) => (
              <Link href={basket.href} className={styles.basketCard} key={basket.name} onClick={dismissPopup}>
                <img src={basket.image} alt={basket.name} />
                <div><strong>{basket.name}</strong><span>{basket.includes}</span><b>View basket · {basket.price}</b></div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
