import { Mail, MessageCircle, Instagram, MapPin, Send } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'

export const metadata = {
  title: 'Contact SIMDI - Pure Himalayan & Pahadi Products Support',
  description: 'Reach out to SIMDI for authentic Himalayan food, handpicked Pahadi products, and support. We are based in Uttarakhand and Ghaziabad.'
}

export default function ContactPage() {
  
  // WhatsApp link generator
  const whatsappNumber = "919211803346"
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Simdi%20Team,%20I%20have%20a%20query%20about%20your%20Pahadi%20products.`

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh', padding: '60px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1E2D24', marginBottom: '15px' }}>
            Connect with SIMDI
          </h1>
          <p style={{ color: '#5E6E5E', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            Have questions about our <strong>authentic Himalayan products</strong>? 
            Our team is here to help you bring the essence of Uttarakhand to your home.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '30px'
        }}>
          
          {/* Contact Details Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* WhatsApp Card */}
            <a href={whatsappUrl} target="_blank" style={{ textDecoration: 'none', ...cardStyle }}>
              <div style={{ ...iconBoxStyle, background: '#25D366', color: 'white' }}><MessageCircle size={26} /></div>
              <div>
                <h3 style={labelStyle}>WhatsApp Us</h3>
                <p style={valueStyle}>+91 9211803346</p>
              </div>
            </a>

            {/* Email Card */}
            <a href="mailto:Team@simdi.in" style={{ textDecoration: 'none', ...cardStyle }}>
              <div style={iconBoxStyle}><Mail size={26} /></div>
              <div>
                <h3 style={labelStyle}>Email Our Team</h3>
                <p style={valueStyle}>Team@simdi.in</p>
              </div>
            </a>

            {/* Instagram Card */}
            <a href="https://instagram.com/simdi.in" target="_blank" style={{ textDecoration: 'none', ...cardStyle }}>
              <div style={{ ...iconBoxStyle, background: 'linear-gradient(45deg, #f09433, #dc2743, #bc1888)', color: 'white' }}>
                <Instagram size={26} />
              </div>
              <div>
                <h3 style={labelStyle}>Instagram</h3>
                <p style={valueStyle}>@simdi.in</p>
              </div>
            </a>

            {/* Location Card */}
            <div style={cardStyle}>
              <div style={iconBoxStyle}><MapPin size={26} /></div>
              <div>
                <h3 style={labelStyle}>Our Roots</h3>
                <p style={valueStyle}>Uttarakhand & Ghaziabad</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={formContainerStyle}>
            <h2 style={{ color: '#1E2D24', marginBottom: '20px', fontSize: '1.6rem', fontFamily: 'Georgia, serif' }}>Send a Quick Inquiry</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" name="name" placeholder="Full Name" required style={inputStyle} />
              <input type="email" name="email" placeholder="Email Address" required style={inputStyle} />
              <textarea name="message" placeholder="Tell us what you are looking for (e.g. Badri Cow Ghee, Himalayan Pulses...)" rows={4} required style={inputStyle}></textarea>
              <button type="submit" style={buttonStyle}>
                Send Message <Send size={18} style={{ marginLeft: '10px' }} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>

      <Footer />
    </>
  )
}

// --- Styles (Objects) ---
const cardStyle = {
  display: 'flex', alignItems: 'center', gap: '18px', background: '#FFFFFF',
  padding: '22px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #E5E1DA', transition: 'all 0.3s ease'
}

const iconBoxStyle = {
  width: '52px', height: '52px', borderRadius: '10px', background: '#1E2D24',
  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
}

const labelStyle = { margin: 0, fontSize: '0.85rem', color: '#666', fontWeight: 600, textTransform: 'uppercase' as const }
const valueStyle = { margin: 0, fontSize: '1.05rem', color: '#1E2D24', fontWeight: 700 }

const formContainerStyle = {
  background: '#FFFFFF', padding: '35px', borderRadius: '15px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #E5E1DA'
}

const inputStyle = {
  width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #D1D5DB',
  fontSize: '1rem', outline: 'none', background: '#FDFDFD'
}

const buttonStyle = {
  background: '#1E2D24', color: 'white', padding: '16px', borderRadius: '8px',
  border: 'none', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s'
}