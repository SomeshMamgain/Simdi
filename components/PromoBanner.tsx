'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('simdiBannerDismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('simdiBannerDismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#2D5A3D',
      borderBottom: '1px solid #234d33',
      color: '#E8F5EC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 40px 8px 16px',
      gap: '8px',
      flexWrap: 'wrap',
      boxSizing: 'border-box',
      fontSize: '13px',
      position: 'relative',
    }}>
      <span style={{ color: '#E8F5EC', fontWeight: 700 }}>Bring the Warmth of the Himalayas Home</span>
      <span style={{ color: '#C8E6D0' }}>Discover curated Winter Baskets of Pahadi grains, pulses, honey, ghee and mountain flavours.</span>
      <Link
        href="/products"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '12px',
          letterSpacing: '0.05em',
          color: '#2D5A3D',
          backgroundColor: '#C8E6D0',
          border: '1px solid #A8D5B5',
          borderRadius: '4px',
          padding: '3px 9px',
          cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
      >
        Explore Winter Baskets
      </Link>

      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#7BAA8A',
          fontSize: '15px',
          lineHeight: 1,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#E8F5EC')}
        onMouseLeave={e => (e.currentTarget.style.color = '#7BAA8A')}
      >
        ✕
      </button>
    </div>
  );
}
