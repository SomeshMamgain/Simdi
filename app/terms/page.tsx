'use client'

import { Suspense } from 'react'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { FileText, ShoppingBag, Tag, ClipboardList, CreditCard, Truck, XCircle, RefreshCw, User, Copyright, AlertTriangle, Scale, RefreshCcw, Phone } from 'lucide-react'

const sections = [
  {
    icon: ShoppingBag,
    number: '01',
    title: 'Products & Services',
    content: (
      <>
        <p style={{ color: '#5E6E5E', marginBottom: '16px', lineHeight: 1.7 }}>
          Simdi sells authentic Himalayan food products including ghee, honey, squash, spices, pulses, grains, and traditional sweets sourced directly from village producers in Uttarakhand.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'All products are subject to availability',
            'Product images are for representation purposes; actual product may slightly vary',
            'We reserve the right to discontinue any product at any time',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: Tag,
    number: '02',
    title: 'Pricing',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'All prices listed on simdi.in are in Indian Rupees (INR) and inclusive of applicable taxes',
          'A nominal handling charge may be applied at checkout',
          'Prices are subject to change without prior notice',
          'In the event of a pricing error, we reserve the right to cancel the order and issue a full refund',
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
    icon: ClipboardList,
    number: '03',
    title: 'Ordering',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'By placing an order, you confirm that all information provided is accurate and complete',
          'We reserve the right to refuse or cancel any order at our sole discretion',
          'Order confirmation will be sent to your registered email address',
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
    number: '04',
    title: 'Payment',
    content: (
      <>
        <div style={{ background: '#F5F2EC', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4D9', marginBottom: '16px' }}>
          <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
            We accept payments via <strong style={{ color: '#1E2D24' }}>Razorpay</strong>, which supports UPI, credit/debit cards, net banking, and wallets. All payments are processed securely — we do not store your payment details.
          </p>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'Orders are processed only after successful payment confirmation',
            'In case of payment failure, the amount will be refunded to the original payment source within 5–7 business days',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: Truck,
    number: '05',
    title: 'Shipping & Delivery',
    content: (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          {[
            { name: 'Courier Partner', desc: 'Shiprocket & associates' },
            { name: 'Delivery Time', desc: '4–7 business days' },
            { name: 'Coverage', desc: 'Pan-India shipping' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#F5F2EC', borderRadius: '12px', padding: '16px', border: '1px solid #E8E4D9' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1E2D24', fontSize: '0.9rem' }}>{item.name}</p>
              <p style={{ margin: 0, color: '#5E6E5E', fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'Delivery timelines are indicative and may vary due to courier delays, holidays, or unforeseen circumstances',
            'Tracking details will be shared via email once your order is dispatched',
            'Simdi is not liable for delays caused by courier partners or circumstances beyond our control',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: XCircle,
    number: '06',
    title: 'Cancellation Policy',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'Orders can be cancelled within 12 hours of placement by contacting us at team@simdi.in',
          'Once the order has been dispatched, cancellation is not possible',
          'In case of a valid cancellation, the full amount will be refunded within 5–7 business days',
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
    icon: RefreshCw,
    number: '07',
    title: 'Refund & Return Policy',
    content: (
      <>
        <p style={{ color: '#5E6E5E', marginBottom: '16px', lineHeight: 1.7 }}>We accept refund/return requests in the following cases:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {[
            { name: 'Wrong product', desc: 'Incorrect item delivered' },
            { name: 'Damaged packaging', desc: 'Tampered on delivery' },
            { name: 'Expired product', desc: 'Unfit for consumption' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#F5F2EC', borderRadius: '12px', padding: '16px', border: '1px solid #E8E4D9' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#1E2D24', fontSize: '0.9rem' }}>{item.name}</p>
              <p style={{ margin: 0, color: '#5E6E5E', fontSize: '0.85rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
          {[
            'Contact us at team@simdi.in within 48 hours of delivery with photos of the issue',
            'Approved refunds will be processed within 7–10 business days to the original payment method',
            'Refunds are not applicable for change of mind or incorrect address provided by the customer',
            'As food products are perishable, returns may not always be possible; we will evaluate each case individually',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B58E58', flexShrink: 0, marginTop: '10px' }} />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: User,
    number: '08',
    title: 'User Responsibilities',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
        {[
          'You agree to use simdi.in only for lawful purposes',
          'You are responsible for maintaining the confidentiality of your account credentials',
          'You agree not to misuse, copy, or reproduce any content from this website without written permission',
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
    icon: Copyright,
    number: '09',
    title: 'Intellectual Property',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        All content on simdi.in including text, images, logos, and product descriptions is the property of Simdi. Unauthorised use or reproduction is strictly prohibited.
      </p>
    ),
  },
  {
    icon: AlertTriangle,
    number: '10',
    title: 'Limitation of Liability',
    content: (
      <div style={{ background: '#F5F2EC', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4D9' }}>
        <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
          Simdi shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our products or website. Our maximum liability is limited to the value of the order placed.
        </p>
      </div>
    ),
  },
  {
    icon: Scale,
    number: '11',
    title: 'Governing Law',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Uttarakhand, India.
      </p>
    ),
  },
  {
    icon: RefreshCcw,
    number: '12',
    title: 'Changes to Terms',
    content: (
      <p style={{ color: '#5E6E5E', lineHeight: 1.8, margin: 0, fontSize: '1rem' }}>
        We reserve the right to update these Terms & Conditions at any time. Continued use of the website after any changes constitutes your acceptance of the revised terms.
      </p>
    ),
  },
  {
    icon: Phone,
    number: '13',
    title: 'Contact Us',
    content: (
      <div style={{ background: '#F5F2EC', borderRadius: '16px', padding: '24px', border: '1px solid #E8E4D9' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Email:</strong>{' '}
            <a href="mailto:team@simdi.in" style={{ color: '#B58E58', textDecoration: 'underline' }}>team@simdi.in</a>
          </p>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>WhatsApp:</strong>{' '}
            <a href="https://wa.me/919211803346" style={{ color: '#B58E58', textDecoration: 'underline' }}>+91 92118 03346</a>
          </p>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Website:</strong>{' '}
            <a href="https://simdi.in" style={{ color: '#B58E58', textDecoration: 'underline' }}>simdi.in</a>
          </p>
          <p style={{ margin: 0, color: '#1E2D24' }}><strong>Business:</strong> Simdi, Uttarakhand / Ghaziabad, India</p>
        </div>
      </div>
    ),
  },
]

export default function TermsAndConditions() {
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
            <FileText size={48} color="#1E2D24" />
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1E2D24', margin: '0 0 20px', lineHeight: 1.15, fontWeight: 700 }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: '#5E6E5E', fontSize: '1rem', margin: '0 0 8px' }}>
            Last updated: May 2025
          </p>
          <p style={{ color: '#5E6E5E', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
            Welcome to Simdi. By accessing or using simdi.in, you agree to be bound by these Terms & Conditions. Please read them carefully before placing an order.
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
          <FileText size={32} color="#B58E58" style={{ margin: '0 auto 16px' }} />
          <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7 }}>
            Questions about our terms? Write to us at{' '}
            <a href="mailto:team@simdi.in" style={{ color: '#B58E58' }}>team@simdi.in</a>{' '}
            or WhatsApp at{' '}
            <a href="https://wa.me/919211803346" style={{ color: '#B58E58' }}>+91 92118 03346</a>
          </p>
        </div>

      </main>

      <Footer />
    </div>
  )
}
