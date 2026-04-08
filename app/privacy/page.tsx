'use client'

import { ShieldCheck, UserCheck, Eye, Lock, Zap } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'

export default function PrivacyPolicy() {
  
  const lastUpdated = "April 04, 2026"

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <div style={{ backgroundColor: '#FDFDFB', minHeight: '100vh', padding: '60px 20px' }}>
        
        {/* Modern, Central Card Container */}
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          background: '#fff', 
          padding: 'clamp(30px, 5vw, 60px)', 
          borderRadius: '24px', 
          boxShadow: '0 20px 60px rgba(30, 45, 36, 0.05)',
          border: '1px solid #E5E1DA'
        }}>
          
          {/* Animated-feel Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '1px solid #EEE', paddingBottom: '30px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#F1EFE9', padding: '8px 16px', borderRadius: '30px', color: '#1E2D24', fontWeight: 600, fontSize: '0.9rem', marginBottom: '15px' }}>
              <ShieldCheck size={18} />
              Your Privacy is Our Priority
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 6vw, 3.5rem)', color: '#1E2D24', margin: '0 0 10px 0', lineHeight: 1.1 }}>
                Privacy Policy
            </h1>
            <p style={{ color: '#666', fontSize: '1rem', fontWeight: 400 }}>Last Updated: {lastUpdated}</p>
          </div>

          {/* Content Section with Modern Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            
            {/* Card 1: Introduction */}
            <div style={cardStyle}>
              <div style={iconHeaderStyle}><Zap size={24} /> <h2 style={{margin: 0, fontSize: '1.5rem'}}>Our Approach</h2></div>
              <p style={textStyle}>
                Welcome to <strong>SIMDI (simdi.in)</strong>. We appreciate your interest in our <strong>authentic Himalayan products</strong>. We value your trust above all else. This policy explains, in simple terms, how we handle your data when you visit our store or purchase from us.
              </p>
            </div>

            {/* Card 2: Essential Data We Collect */}
            <div style={cardStyle}>
              <div style={iconHeaderStyle}><UserCheck size={24} /> <h2 style={{margin: 0, fontSize: '1.5rem'}}>What We Collect</h2></div>
              <p style={textStyle}>We only ask for the information necessary to fulfill your order and improve your shopping experience. This includes:</p>
              <ul style={listStyle}>
                <li>Contact Details (Name, Shipping Address, Email) for delivery.</li>
                <li>Order History for seamless future support.</li>
                <li>Device Information (like IP address, browser type) to optimize our website.</li>
              </ul>
            </div>

            {/* Card 3: How We Use It */}
            <div style={cardStyle}>
              <div style={iconHeaderStyle}><Eye size={24} /> <h2 style={{margin: 0, fontSize: '1.5rem'}}>How We Use It</h2></div>
              <p style={textStyle}>We process your information for these specific, transparent reasons:</p>
              <ul style={listStyle}>
                <li>To deliver <strong>pure Uttarakhand food products</strong> directly to you.</li>
                <li>To provide order updates and customer support.</li>
                <li>To ensure our website remains safe, secure, and user-friendly.</li>
              </ul>
            </div>

            {/* Card 4: Uncompromised Security */}
            <div style={cardStyle}>
              <div style={iconHeaderStyle}><Lock size={24} /> <h2 style={{margin: 0, fontSize: '1.5rem'}}>Security & Sharing</h2></div>
              <p style={textStyle}>
                Your data security is paramount. We implement strict security measures to prevent unauthorized access.
              </p>
              <p style={textStyle}>
                We never sell your personal data. We only share essential details with trusted partners (like payment processors and delivery services) necessary for order completion.
              </p>
            </div>

          </div>

          {/* Simplified Legal Note & Contact - No email/number here */}
          <div style={{ marginTop: '70px', background: '#F9F7F2', padding: '30px', borderRadius: '15px', textAlign: 'center', border: '1px solid #EEE' }}>
            <h3 style={{ color: '#1E2D24', marginBottom: '10px' }}>Questions about this policy?</h3>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>
              We try to keep this simple. If something is unclear or you want to discuss your data rights, please contact our support team directly. We are committed to transparency and respect for your privacy.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}

// --- Internal Styles ---
const cardStyle = {
  background: '#FFFFFF',
  padding: '30px',
  borderRadius: '16px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.02)',
  border: '1px solid #F0EFEA',
  transition: 'transform 0.2s ease',
}

const iconHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px',
  color: '#B58E58', // Accent gold color
  fontFamily: 'Georgia, serif',
}

const textStyle = { color: '#444', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '15px' }
const listStyle = { color: '#444', lineHeight: '1.8', fontSize: '1.05rem', paddingLeft: '20px', margin: 0 }