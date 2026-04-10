'use client'

import Link from 'next/link'
import { Facebook, Instagram, Mail, MapPin, ShieldCheck, Truck } from 'lucide-react'

export const Footer = () => {
  const sectionStyle = { display: 'flex', flexDirection: 'column' as const, gap: '15px' };
  const headingStyle = { color: '#B58E58', textTransform: 'uppercase' as const, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' };
  const linkStyle = { color: '#F9F7F2', textDecoration: 'none', fontSize: '0.9rem', display: 'block', marginBottom: '8px', transition: '0.3s' };

  return (
    <footer style={{ backgroundColor: '#1E2D24', color: '#F9F7F2', padding: '60px 20px 30px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px', marginBottom: '50px' }}>
          
          {/* Column 1 */}
          <div style={{ flex: '1 1 250px', ...sectionStyle }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#B58E58', margin: 0 }}>SIMDI</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.8 }}>
              Bringing the untouched purity of Himalayan villages to your doorstep. Supporting 35+ women artisans across Uttarakhand.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="https://www.facebook.com/SimdiUK12" target="_blank" rel="noopener noreferrer" style={{ color: '#F9F7F2' }}>
                <Facebook size={22} />
              </a>
              <a href="https://www.instagram.com/simdi.in" target="_blank" rel="noopener noreferrer" style={{ color: '#F9F7F2' }}>
                <Instagram size={22} />
              </a>
            </div>
          </div>

          {/* Column 2: FIXED LINKS */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={headingStyle}>Shop Organic</h4>
            <div style={{ marginTop: '20px' }}>
              
              <Link href="/products/ghee" style={linkStyle}>
                Pure Bilona Ghee
              </Link>

              <Link href="/products/pahadi-shahad" style={linkStyle}>
                Raw Wild Honey
              </Link>

              <Link href="/products/himalayan-omega-boost" style={linkStyle}>
                Seabuckthorn
              </Link>

              <Link href="/products/chawal-pahadi-white-rice" style={linkStyle}>
                Chawal (Mountain Rice)
              </Link>

            </div>
          </div>

          {/* Column 3 */}
          <div style={{ flex: '1 1 150px' }}>
            <h4 style={headingStyle}>Support & Stories</h4>
            <div style={{ marginTop: '20px' }}>
              <Link href="/our-roots" style={linkStyle}>Our Story</Link>
              <Link href="/blogs" style={linkStyle}>Blogs</Link>
              <Link href="/contact" style={linkStyle}>Contact Us</Link>
              <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>
            </div>
          </div>

          {/* Column 4 */}
          <div style={{ flex: '1 1 200px', ...sectionStyle }}>
            <h4 style={headingStyle}>Our Roots</h4>
            <div style={{ marginTop: '5px', fontSize: '0.9rem', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <MapPin size={18} style={{ color: '#B58E58', flexShrink: 0 }} />
                <span>SIMDI, Chakisain, Pauri Garhwal,<br />Uttarakhand - 246130</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <Mail size={18} style={{ color: '#B58E58', flexShrink: 0 }} />
                <span>Team@simdi.in</span>
              </div>
              <div style={{ display: 'flex', gap: '25px' }}>
                <div style={{ textAlign: 'center' }}>
                  <ShieldCheck size={24} style={{ color: '#B58E58', margin: '0 auto' }} />
                  <p style={{ fontSize: '0.65rem', marginTop: '5px', fontWeight: 700 }}>100% PURE</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Truck size={24} style={{ color: '#B58E58', margin: '0 auto' }} />
                  <p style={{ fontSize: '0.65rem', marginTop: '5px', fontWeight: 700 }}>PAN INDIA</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '30px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', fontSize: '0.75rem', opacity: 0.6 }}>
          <p>© 2026 SIMDI. From the heart of Uttarakhand.</p>
          <div style={{ display: 'flex', gap: '30px' }}>
            <span>FSSAI Certified</span>
            <span>Handcrafted with Love</span>
          </div>
        </div>
      </div>
    </footer>
  )
}