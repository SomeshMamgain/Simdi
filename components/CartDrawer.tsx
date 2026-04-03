'use client'

import { useCartStore } from '@/store/cartStore'
import { X } from 'lucide-react'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, removeItem, totalItems } = useCartStore()

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100vh',
        width: '380px', background: '#F9F7F2', zIndex: 101,
        padding: '30px', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '1.4rem', color: '#1E2D24' }}>
            Your Cart ({totalItems()})
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E2D24' }}>
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {items.length === 0 ? (
            <p style={{ color: '#5E6E5E', textAlign: 'center', marginTop: '60px' }}>Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.id} style={{
                display: 'flex', gap: '15px', marginBottom: '20px',
                paddingBottom: '20px', borderBottom: '1px solid #eee'
              }}>
                <img src={item.img} alt={item.name} style={{
                  width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px'
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#1E2D24', fontSize: '0.9rem' }}>{item.name}</p>
                  <p style={{ color: '#B58E58', fontWeight: 700, marginTop: '4px' }}>{item.price}</p>
                  <p style={{ fontSize: '0.8rem', color: '#5E6E5E' }}>Qty: {item.quantity}</p>
                </div>
                <button onClick={() => removeItem(item.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.2rem'
                }}>×</button>
              </div>
            ))
          )}
        </div>

        {/* Checkout Button */}
        {items.length > 0 && (
          <button style={{
            width: '100%', padding: '16px', background: '#1E2D24',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em'
          }}>
            PROCEED TO CHECKOUT
          </button>
        )}
      </div>
    </>
  )
}