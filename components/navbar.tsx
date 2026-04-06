'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './CartDrawer'

export const Navbar = () => {
  const totalItems = useCartStore((state) => state.totalItems())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/shop' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Our Roots', href: '/our-roots' },
  ]

  return (
    <>
      <header className="navbar">
        {/* Mobile Menu Trigger */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Brand */}
        <Link href="/" className="brand-container">
          <Image src="/logo.jpeg" alt="SIMDI Logo" width={40} height={40} style={{ borderRadius: '25px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-text">SIMDI</span>
            <span className="tagline">
              BE PAHADI • BUY PAHADI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="nav-link">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button className="icon-btn"><Search size={22} /></button>
          <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative' }} className="icon-btn">
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-overlay${isMobileMenuOpen ? ' is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={32} color="#1E2D24" />
        </button>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-link">
            {label}
          </Link>
        ))}
      </div>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
