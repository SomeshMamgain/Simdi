'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, User, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { CartDrawer } from './CartDrawer'

export const Navbar = () => {
  const totalItems = useCartStore((state) => state.totalItems())
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: '#B8AFA0',
        borderBottom: '1px solid #a09890',
        padding: '0 40px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.jpeg" alt="SIMDI Logo" width={36} height={36} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#1E2D24', letterSpacing: '2px', lineHeight: 1 }}>
              SIMDI
            </span>
            <span style={{ fontSize: '0.55rem', color: '#1E2D24', fontFamily: 'sans-serif', fontWeight: 700, letterSpacing: '2px', marginTop: '3px' }}>
              BE PAHADI • BUY PAHADI
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav style={{ display: 'flex', gap: '36px' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/shop' },
            { label: 'Blog', href: '/blogs' },
            { label: 'Our Roots', href: '/our-roots' },
          ].map(({ label, href }) => (
            <Link key={label} href={href} style={{
              color: '#1E2D24',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E2D24', display: 'flex' }}>
            <Search size={20} />
          </button>
          <Link href="/account" style={{ color: '#1E2D24', display: 'flex' }}>
            <User size={20} />
          </Link>
          <button onClick={() => setDrawerOpen(true)} style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', color: '#1E2D24', display: 'flex'
          }}>
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#B58E58', color: '#fff',
                fontSize: '10px', width: '18px', height: '18px',
                borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </header>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}