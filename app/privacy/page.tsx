'use client'

import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { Shield, Eye, CreditCard, Share2, Cookie, Lock, UserCheck, RefreshCw, AlertCircle, MessageCircle, Phone } from 'lucide-react'

const sections = [
  {
    icon: Eye,
    number: '01',
    title: 'Information We Collect',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'Name, email address, and phone number (when you place an order or contact us)',
          'Shipping address and billing details',
          'Payment information (processed securely via Razorpay — we do not store card details)',
          'Device and browser information, IP address',
          'Usage data via Google Analytics (pages visited, time spent, etc.)',
        ].map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: UserCheck,
    number: '02',
    title: 'How We Use Your Information',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'To process and fulfil your orders',
          'To send order confirmations and delivery updates',
          'To respond to your queries and provide customer support',
          'To improve our website and user experience',
          'To send occasional updates about new products (only if you have opted in)',
        ].map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: CreditCard,
    number: '03',
    title: 'Payment Information',
    content: (
      <div style={{ background: '#F5F2EC', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4D9' }}>
        <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
          We use <strong style={{ color: '#1E2D24' }}>Razorpay</strong> as our payment gateway. All payment transactions are encrypted and processed directly by Razorpay. We do not store your card number, CVV, or any sensitive payment information on our servers. Your payment data is subject to{' '}
          <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: '#B58E58', textDecoration: 'underline' }}>
            Razorpay&apos;s Privacy Policy
          </a>.
        </p>
      </div>
    ),
  },
  {
    icon: Share2,
    number: '04',
    title: 'Sharing Your Information',
    content: (
      <>
        <p style={{ color: '#5E6E5E', marginBottom: '16px', lineHeight: 1.7 }}>We do not sell or rent your personal information. We may share your data only with:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Razorpay', desc: 'Payment processing' },
            { name: 'Shiprocket', desc: 'Order delivery' },
            { name: 'Google Analytics', desc: 'Website analytics (anonymised)' },
            { name: 'Google Ads', desc: 'Advertising (anonymised)' },
            { name: 'Legal authorities', desc: 'If required by law' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#F5F2EC', borderRadius: '12px', padding: '16px', border: '1px solid #E8E4D9' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1E2D24', fontSize: '0.9rem' }}>{item.name}</p>
              <p style={{ margin: 0, color: '#5E6E5E', fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: Cookie,
    number: '05',
    title: 'Cookies',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        We use cookies to enhance your browsing experience, analyse site traffic, and serve relevant advertisements. You can disable cookies in your browser settings, though some features of the site may not function properly.
      </p>
    ),
  },
  {
    icon: Lock,
    number: '06',
    title: 'Data Security',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        We implement reasonable security measures to protect your personal data from unauthorised access, alteration, or disclosure. However, no method of internet transmission is 100% secure.
      </p>
    ),
  },
  {
    icon: UserCheck,
    number: '07',
    title: 'Your Rights',
    content: (
      <>
        <p style={{ color: '#5E6E5E', marginBottom: '12px', lineHeight: 1.7 }}>You have the right to:</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'Access the personal data we hold about you',
            'Request correction or deletion of your data',
            'Opt out of marketing communications at any time',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
              {item}
            </li>
          ))}
        </ul>
        <p style={{ color: '#5E6E5E', margin: 0 }}>
          To exercise these rights, contact us at{' '}
          <a href="mailto:team@simdi.in" style={{ color: '#B58E58', textDecoration: 'underline' }}>team@simdi.in</a>.
        </p>
      </>
    ),
  },
  {
    icon: RefreshCw,
    number: '08',
    title: 'Refund & Cancellation',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        For information about refunds and cancellations, please refer to our{' '}
        <a href="/terms" style={{ color: '#B58E58', textDecoration: 'underline' }}>Terms & Conditions</a>.
      </p>
    ),
  },
  {
    icon: RefreshCw,
    number: '09',
    title: 'Changes to This Policy',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised date. Continued use of our website after changes constitutes your acceptance of the updated policy.
      </p>
    ),
  },
  {
    icon: AlertCircle,
    number: '10',
    title: 'Consent',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        By using simdi.in, you agree to the terms of this Privacy Policy and consent to the collection and use of your information as described herein.
      </p>
    ),
  },
  {
    icon: MessageCircle,
    number: '11',
    title: 'Grievance Officer',
    content: (
      <div style={{ background: '#F5F2EC', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4D9' }}>
        <p style={{ color: '#5E6E5E', marginBottom: '16px', lineHeight: 1.7 }}>
          In accordance with the Information Technology Act, 2000 and rules made thereunder, you may contact our Grievance Officer:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Name:</strong> Team Simdi</p>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Email:</strong>{' '}
            <a href="mailto:team@simdi.in" style={{ color: '#B58E58', textDecoration: 'underline' }}>team@simdi.in</a>
          </p>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Address:</strong> Uttarakhand / Ghaziabad, India</p>
        </div>
        <p style={{ margin: '16px 0 0', color: '#5E6E5E', fontSize: '0.85rem' }}>We will respond to grievances within 30 days of receipt.</p>
      </div>
    ),
  },
  {
    icon: Phone,
    number: '12',
    title: 'Contact Us',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        For any privacy-related questions, write to us at{' '}
        <a href="mailto:team@simdi.in" style={{ color: '#B58E58', textDecoration: 'underline' }}>team@simdi.in</a>{' '}
        or WhatsApp us at{' '}
        <a href="https://wa.me/919211803346" style={{ color: '#B58E58', textDecoration: 'underline' }}>+91 92118 03346</a>.
      </p>
    ),
  },
]

export default function PrivacyPolicy() {
  return (
    <div className="site-page-shell site-page-shell--hidden-overflow">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 20px 80px' }}>

        {/* Hero Header */}
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span style={{ color: '#B58E58', fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
            Legal &amp; Compliance
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0 16px' }}>
            <Shield size={48} color="#1E2D24" />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1E2D24', margin: '0 0 20px', lineHeight: 1.15, fontWeight: 700 }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#5E6E5E', fontSize: '1rem', margin: '0 0 8px' }}>
            Last updated: May 2025
          </p>
          <p style={{ color: '#5E6E5E', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
            Simdi.in is operated by simdi.in, based in Uttarakhand / Ghaziabad, India. We are committed to protecting your personal information and your right to privacy.
          </p>
        </header>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <div
                key={section.number}
                style={{
                  background: '#fff',
                  borderRadius: '24px',
                  padding: '40px',
                  border: '1px solid #E8E4D9',
                  display: 'flex',
                  gap: '32px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left: number + icon */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#F5F2EC', border: '1px solid #E8E4D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color="#1E2D24" />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#B58E58', letterSpacing: '0.1em' }}>{section.number}</span>
                </div>

                {/* Right: content */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.4rem', color: '#1E2D24', margin: '0 0 20px', fontWeight: 700 }}>
                    {section.title}
                  </h2>
                  {section.content}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: '60px', textAlign: 'center', padding: '40px', background: '#1E2D24', borderRadius: '24px', color: '#A3B3A3' }}>
          <Shield size={32} color="#B58E58" style={{ margin: '0 auto 16px' }} />
          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>
            Your privacy matters to us. If you have any questions about this policy,<br />
            write to us at{' '}
            <a href="mailto:team@simdi.in" style={{ color: '#B58E58' }}>team@simdi.in</a>
          </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
