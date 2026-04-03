'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Mountain, Shield } from 'lucide-react'

const bestSellers = [
  { id: 1, name: 'Organic Pahadi Ghee', price: '₹799', img: '/ghee.jpg' },
  { id: 2, name: 'Raw Wild Honey', price: '₹649', img: '/wild_honey.jpg' },
  { id: 3, name: 'Pahadi Red Rice', price: '₹349', img: '/pahad-rice.png' },
  { id: 4, name: 'Traditional Pisyu Loon', price: '₹199', img: '/pisyu_loon.jpg' },
]

const features = [
  { icon: <Leaf size={28} />, title: 'Certified Organic', desc: 'No pesticides, no chemicals. Grown the way nature intended in the pristine hills of Uttarakhand.' },
  { icon: <Mountain size={28} />, title: 'Himalayan Origin', desc: 'Sourced from altitudes above 1500m where clean air and glacier water produce the purest ingredients.' },
  { icon: <Heart size={28} />, title: 'Women Empowered', desc: 'Every purchase directly supports 35+ women artisans and their families in Pauri Garhwal villages.' },
  { icon: <Shield size={28} />, title: 'FSSAI Certified', desc: "All products are lab-tested and certified. What you see on the label is exactly what's in the jar." },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#F9F7F2', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 500px' }}>
            <p style={{ color: '#B58E58', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '20px', fontWeight: 600 }}>
              STRAIGHT FROM THE HILLS
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: 1.1, margin: 0 }}>
              <span style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#1E2D24' }}>Crafted by Mountains.</span>
              <span style={{ display: 'block', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#B58E58', marginTop: '10px' }}>Untouched by Cities</span>
            </h1>
            <p style={{ marginTop: '20px', maxWidth: '450px', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
              Buy pure organic Himalayan products online — Bilona Ghee, Wild Honey, Pahadi Rice, and traditional spices. Sourced directly from women farmers in Uttarakhand.
            </p>
            <Link href="/shop">
              <button style={{ marginTop: '30px', padding: '16px 36px', background: '#1E2D24', color: '#fff', border: 'none', letterSpacing: '0.1em', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                EXPLORE PRODUCTS <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
              <img src="/mahila.jpeg" alt="Himalayan women artisans Uttarakhand" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            <div style={{ background: '#1E2D24', color: '#fff', padding: '25px', marginTop: '-20px', position: 'relative', zIndex: 1, marginInline: '20px' }}>
              <h4 style={{ color: '#B58E58', marginBottom: '8px', fontSize: '1.1rem' }}>Empowering Himalayan Roots</h4>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, lineHeight: 1.5 }}>Supporting women-led cooperatives across Pauri Garhwal, Uttarakhand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SIMDI - FEATURES */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#B58E58', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', marginBottom: '12px' }}>WHY CHOOSE SIMDI</p>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '2.2rem', color: '#1E2D24', textAlign: 'center', marginBottom: '50px' }}>
            Pure. Natural. Himalayan.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {features.map((f, i) => (
              <div key={i} style={{ padding: '32px 24px', border: '1px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ color: '#B58E58', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Georgia', fontSize: '1.1rem', color: '#1E2D24', marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: '#5E6E5E', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section style={{ padding: '100px 20px', background: '#F9F7F2' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '60px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/born_with_love.jpg" alt="Handcrafted organic products Uttarakhand" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ flex: '1 1 500px' }}>
            <h2 style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: '1.5rem', color: '#B58E58' }}>Born in the Mountains</h2>
            <h3 style={{ fontFamily: 'Georgia', fontSize: '3rem', fontWeight: 700, color: '#1E2D24', marginTop: '10px', marginBottom: '30px' }}>Made with Love</h3>
            <div style={{ color: '#5E6E5E', fontSize: '1.05rem', lineHeight: 1.85, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p>High in the Himalayas, life moves with the rhythm of seasons. Village women carry centuries of wisdom — from making Bilona ghee at dawn to harvesting wild honey from cliffsides.</p>
              <p>Simdi was born to bridge mountain hearts and modern homes. We work directly with farmer cooperatives in Chakisain, Pauri Garhwal — cutting out middlemen so artisans earn fairly and you get products that are genuinely pure.</p>
              <p>When you buy from Simdi, you're not just buying food. You're preserving a way of life.</p>
            </div>
            <Link href="/our-roots">
              <button style={{ marginTop: '30px', padding: '14px 32px', background: 'transparent', color: '#1E2D24', border: '1px solid #1E2D24', letterSpacing: '0.1em', fontSize: '0.8rem', cursor: 'pointer' }}>
                READ OUR STORY
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ background: '#1E2D24', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '40px', textAlign: 'center' }}>
          {[
            { val: '12+', label: 'Villages Connected' },
            { val: '35+', label: 'Women Empowered' },
            { val: '100%', label: 'Organic Products' },
            { val: '500+', label: 'Happy Families' },
          ].map((s, i) => (
            <div key={i} style={{ flex: '1 1 180px' }}>
              <p style={{ color: '#B58E58', fontSize: '3.5rem', fontWeight: 800, margin: 0 }}>{s.val}</p>
              <p style={{ color: '#F9F7F2', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '10px' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section style={{ padding: '100px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#B58E58', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', marginBottom: '12px' }}>CUSTOMER FAVOURITES</p>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1E2D24', textAlign: 'center', marginBottom: '12px' }}>Our Best Sellers</h2>
          <p style={{ color: '#5E6E5E', textAlign: 'center', fontSize: '0.95rem', marginBottom: '50px' }}>
            Buy organic Pahadi products trusted by thousands of families across India.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
            {bestSellers.map(p => (
              <div key={p.id} style={{ flex: '1 1 260px', maxWidth: '300px', border: '1px solid #eee', padding: '15px', borderRadius: '12px' }}>
                <div style={{ backgroundColor: '#f3f4f6', height: '280px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: '#1E2D24', marginBottom: '5px' }}>{p.name}</h3>
                <p style={{ color: '#B58E58', fontWeight: 700, fontSize: '1.1rem' }}>{p.price}</p>
                <button style={{ marginTop: '15px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #1E2D24', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}>
                  ADD TO CART
                </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/shop">
              <button style={{ padding: '14px 40px', background: '#1E2D24', color: '#fff', border: 'none', letterSpacing: '0.1em', fontSize: '0.8rem', cursor: 'pointer' }}>
                VIEW ALL PRODUCTS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO SECTION */}
      <section style={{ padding: '80px 20px', background: '#F9F7F2', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '2rem', color: '#1E2D24', marginBottom: '20px' }}>
            Buy Authentic Organic Products from Uttarakhand Online
          </h2>
          <p style={{ color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.9, marginBottom: '20px' }}>
            Simdi is your trusted source for <strong>pure organic Himalayan products</strong> — including <strong>Bilona A2 Ghee</strong>, <strong>raw wild honey</strong>, <strong>Pahadi red rice</strong>, and traditional <strong>Pisyu Loon</strong> (Pahadi salt). All our products are handcrafted using age-old methods in the villages of <strong>Pauri Garhwal, Uttarakhand</strong>.
          </p>
          <p style={{ color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.9 }}>
            We believe in <strong>farm-to-home transparency</strong>, <strong>women empowerment</strong>, and zero compromise on purity. Whether you're looking for the best ghee online, natural honey without additives, or traditional hill grains — Simdi delivers the Himalayas to your doorstep with <strong>pan-India shipping</strong> and <strong>FSSAI certification</strong>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}