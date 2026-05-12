'use client';

import { useState, useEffect } from 'react';

const EXPIRY_DATE = new Date('2026-06-01T00:00:00+05:30'); // 31 May midnight IST

export default function PromoBanner() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (new Date() >= EXPIRY_DATE) return;
    const dismissed = sessionStorage.getItem('simdiBannerDismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText('SIMDIWELCOME').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <span style={{ color: '#A8D5B5', fontWeight: 700 }}>15% off</span>
      <span style={{ color: '#C8E6D0' }}>on orders above ₹1000 — use code</span>

      <button
        onClick={copyCode}
        title="Click to copy"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'monospace',
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
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B8D9C3')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#C8E6D0')}
      >
        SIMDIWELCOME
        <span style={{
          fontFamily: 'sans-serif',
          fontWeight: 500,
          fontSize: '10px',
          color: copied ? '#2D5A3D' : '#4A7A5A',
          backgroundColor: copied ? '#A8D5B5' : 'transparent',
          borderRadius: '3px',
          padding: copied ? '1px 4px' : '0',
          transition: 'all 0.2s',
        }}>
          {copied ? '✓ copied' : 'copy'}
        </span>
      </button>

      <span style={{ color: '#8BB89A', fontSize: '11px' }}>· valid till 31 May</span>

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
