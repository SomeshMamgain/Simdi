'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { ShieldCheck, Leaf, Target, Eye, Users, Map, Wheat, MapPin } from 'lucide-react'
import { Suspense } from 'react'

export default function OurRoots() {
  const containerStyle = { maxWidth: '1200px', margin: '0 auto', padding: '0 20px' };
  const sectionStyle = { padding: '80px 0' };
  const headingStyle = { fontFamily: 'Georgia, serif', fontSize: '3rem', color: '#1E2D24', marginBottom: '20px' };
  const paraStyle = { color: '#5E6E5E', fontSize: '1.1rem', lineHeight: 1.8 };

  return (
    <div className="site-page-shell site-page-shell--hidden-overflow">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      
      {/* 1. HERO SECTION */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={containerStyle}>
          <p style={{ color: '#B58E58', letterSpacing: '0.4em', fontSize: '0.75rem', fontWeight: 800, marginBottom: '20px' }}>PRESERVING HIMALAYAN HERITAGE</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, color: '#1E2D24', lineHeight: 1, margin: '0 0 15px' }}>Our Roots</h1>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontStyle: 'italic', color: '#B58E58', marginBottom: '40px' }}>Purity from the Peaks to your Pantry</p>
          <p style={{ ...paraStyle, maxWidth: '950px', margin: '0 auto' }}>
            Simdi’s journey began in the untouched altitudes of Uttarakhand, born out of a deep respect for <strong>Himalayan heritage and organic farming</strong>. We are dedicated to preserving and bringing you the mystical purity of ancient mountain treasures—from handcrafted <strong>A2 Badri Cow Ghee</strong> and <strong>Raw Wild Forest Honey</strong> to nutrient-dense <strong>Pahadi Grains like Mandua and Red Rice</strong>. Sourced directly from the rugged terrains of Pauri Garhwal, every product we offer is a testament to the centuries-old wisdom of hill farming. Our mission goes beyond just commerce; we are committed to fostering sustainable growth in rural Uttarakhand, ensuring that the authentic essence of the hills reaches your home exactly as nature intended, while empowering local women and preserving the biodiversity of our sacred mountains.
          </p>
        </div>
      </section>

      {/* 2. OUR MISSION */}
      <section style={{ ...sectionStyle, background: '#fff' }}>
        <div style={{ ...containerStyle, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '50px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#1E2D24', padding: '10px', borderRadius: '8px' }}><Target className="text-[#B58E58]" size={24} /></div>
              <h2 style={headingStyle}>Our Mission</h2>
            </div>
            <p style={paraStyle}>
              Our core mission is to create a transparent bridge between the <strong>health-conscious urban consumer</strong> and the unspoiled agricultural purity of the Himalayas. We strive to replace mass-processed, chemical-laden staples with <strong>hand-churned Bilona Ghee</strong> and organic pulses that are free from pesticides. By eliminating middlemen, we ensure that the maximum profit returns to our hardworking farmers in <strong>Pauri Garhwal</strong>, promoting a model of ethical and sustainable trade.
            </p>
          </div>
          <div style={{ flex: '1 1 350px', textAlign: 'right' }}>
            <img src="/mission.png" alt="Simdi Mission" style={{ width: '100%', maxWidth: '400px', borderRadius: '30px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* 3. OUR VISION */}
      <section style={sectionStyle}>
        <div style={{ ...containerStyle, display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', gap: '50px' }}>
          <div style={{ flex: '1 1 350px', textAlign: 'left' }}>
            <img src="/simdi.jpg" alt="Simdi Vision" style={{ width: '100%', maxWidth: '400px', borderRadius: '30px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#1E2D24', padding: '10px', borderRadius: '8px' }}><Eye className="text-[#B58E58]" size={24} /></div>
              <h2 style={headingStyle}>Our Vision</h2>
            </div>
            <p style={paraStyle}>
              We envision a future where <strong>Himalayan Superfoods</strong> are a staple in every global kitchen, recognized for their superior nutritional profile and healing properties. Simdi aims to become the benchmark for <strong>"Purity from the Peaks"</strong>, creating a sustainable economy that prevents the forced migration of Uttarakhand's youth. We are building a legacy where tradition meets modern quality standards, ensuring our mountain heritage survives and thrives for generations to come.
            </p>
          </div>
        </div>
      </section>

      {/* 4. IMPACT SECTION */}
      <section style={{ padding: '80px 0', background: '#1E2D24', color: '#fff', textAlign: 'center' }}>
        <div style={containerStyle}>
          <h2 style={{ ...headingStyle, color: '#fff' }}>The Simdi Impact</h2>
          <div style={{ background: '#B58E58', height: '3px', width: '60px', margin: '0 auto 50px' }}></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
            {[
              { icon: <Users size={40} />, title: 'Women-Led', desc: 'Sourcing directly from women-led cooperatives in Uttarakhand.' },
              { icon: <Map size={40} />, title: 'Anti-Migration', desc: 'Creating dignified livelihoods to keep families together in their villages.' },
              { icon: <Wheat size={40} />, title: 'Bio-Diversity', desc: 'Cultivating ancient grains that are naturally pest-resistant.' }
            ].map((item, i) => (
              <div key={i} style={{ flex: '1 1 300px', maxWidth: '320px' }}>
                <div style={{ color: '#B58E58', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION DIVIDER --- */}
        <div style={{ 
          marginTop: '80px', 
          height: '1px', 
          width: '100%', 
          background: 'linear-gradient(to right, transparent, rgba(181, 142, 88, 0.4), transparent)' 
        }}></div>
      </section>

      {/* 5. TRUST STRIP (Separation before Footer) */}
      <section style={{ background: '#141E18', padding: '35px 0' }}>
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
          {[
            { icon: <ShieldCheck size={18} color="#B58E58" />, text: 'SECURE PAYMENTS' },
            { icon: <Leaf size={18} color="#B58E58" />, text: '100% ORGANIC' },
            { icon: <MapPin size={18} color="#B58E58" />, text: 'SHIPPED FROM HIMALAYAS' }
          ].map((item, idx) => (
            <div key={idx} style={{ color: '#A3B3A3', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.icon} {item.text}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
