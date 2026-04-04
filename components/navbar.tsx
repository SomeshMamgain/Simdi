'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
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
      <style jsx>{`
        header {
          position: sticky; top: 0; z-index: 100;
          background: #B8AFA0;
          border-bottom: 1px solid #a09890;
          padding: 0 40px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-text {
          font-family: 'Quicksand', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          color: #1E2D24;
          letter-spacing: 1px;
          line-height: 1;
        }

        .nav-desktop { display: flex; gap: 30px; }
        
        .mobile-menu-btn { display: none; background: none; border: none; cursor: pointer; color: #1E2D24; }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          header { padding: 0 15px; height: 75px; }
          .nav-desktop { display: none; }
          .mobile-menu-btn { display: block; order: -1; } /* Burger menu left side pe */
          .brand-container { flex: 1; text-align: center; justify-content: center; margin-right: 20px; }
          .tagline { font-size: 0.45rem !important; letter-spacing: 1px !important; }
        }

        /* Full Screen Mobile Menu Overlay */
        .mobile-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
          background: #B8AFA0; z-index: 101;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 30px; transition: 0.3s ease;
          transform: ${isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
        }
      `}</style>

      <header>
        {/* Mobile Menu Trigger */}
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={28} />
        </button>

        {/* Brand */}
        <Link href="/" className="brand-container" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Image src="/logo.jpeg" alt="SIMDI Logo" width={34} height={34} style={{ borderRadius: '10px' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-text">SIMDI</span>
            <span className="tagline" style={{ fontSize: '0.55rem', color: '#1E2D24', fontFamily: 'sans-serif', fontWeight: 800, letterSpacing: '2px', marginTop: '2px' }}>
              BE PAHADI • BUY PAHADI
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-desktop">
          {navLinks.map(({ label, href }) => (
            <Link key={label} href={href} style={{ color: '#1E2D24', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button style={{ background: 'none', border: 'none', color: '#1E2D24' }}><Search size={22} /></button>
          <button onClick={() => setDrawerOpen(true)} style={{ position: 'relative', background: 'none', border: 'none', color: '#1E2D24' }}>
            <ShoppingBag size={22} />
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#B58E58', color: '#fff', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className="mobile-overlay">
        <button onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none' }}>
          <X size={32} color="#1E2D24" />
        </button>
        {navLinks.map(({ label, href }) => (
          <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1E2D24', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 700 }}>
            {label}
          </Link>
        ))}
      </div>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}