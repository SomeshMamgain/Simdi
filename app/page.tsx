import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Mountain, Shield } from 'lucide-react'
import { Suspense } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { ImageCarousel } from '@/components/ImageCarousel'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ReviewsSection } from '@/components/Review/Review'
import { SITE_NAME, buildMetadata, getAbsoluteAssetUrl, getCanonicalUrl } from '@/lib/seo'
import { getProducts } from '@/lib/product-service'

const homepageKeywords = [
  'SIMDI',
  'Your Himalayan Friend',
  'authentic Pahadi products',
  'Himalayan products online',
  'organic Himalayan products',
  'Uttarakhand products',
  'organic Pahadi ghee',
  'raw wild honey',
  'mountain grains',
  'Himalayan wellness products',
  'handicrafts from Uttarakhand',
  'seasonal Himalayan products',
  'Uttarakhand ride booking',
  'mountain taxi service Uttarakhand',
  'parcel delivery Uttarakhand',
  'women-led village products',
  'fair trade Himalayan products',
  'Pauri Garhwal products',
  'Chakisain Uttarakhand',
]

export const metadata: Metadata = buildMetadata({
  title: 'SIMDI | Your Himalayan Friend for Pahadi Products, Rides & Parcels',
  description:
    'Products, rides, and deliveries straight from Himalayan villages. Shop authentic Pahadi products, book Uttarakhand mountain rides, and send parcels with SIMDI.',
  path: '/',
  keywords: homepageKeywords,
  images: ['/hero_simdi.jpg'],
  imageAlt: 'SIMDI homepage featuring Himalayan products and village sourcing',
})

const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
      logo: getAbsoluteAssetUrl('/apple-icon.png'),
      image: getAbsoluteAssetUrl('/hero_simdi.jpg'),
      description:
        'SIMDI connects people with authentic Himalayan products, local delivery support, and Uttarakhand-rooted experiences.',
      areaServed: 'India',
    },
    {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: getCanonicalUrl('/'),
      description:
        'Explore authentic Pahadi products, Himalayan pantry essentials, and stories from Uttarakhand.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${getCanonicalUrl('/products')}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

const features = [
  { icon: <Leaf size={28} />, title: 'Certified Organic', desc: 'No pesticides, no chemicals. Grown the way nature intended in the pristine hills of Uttarakhand.' },
  { icon: <Mountain size={28} />, title: 'Himalayan Origin', desc: 'Sourced from altitudes above 1500m where clean air and glacier water produce the purest ingredients.' },
  { icon: <Heart size={28} />, title: 'Women Empowered', desc: 'Every purchase directly supports 35+ women artisans and their families in Pauri Garhwal villages.' },
  { icon: <Shield size={28} />, title: 'FSSAI Certified', desc: "All products are lab-tested and certified. What you see on the label is exactly what's in the jar." },
]

export default async function Home() {
  const products = await getProducts()
  const bestSellers = products
  .filter(p => Number(p.review) > 0 && Number(p.review) !== 100)
  .sort((a, b) => Number(b.review) - Number(a.review)) // descending (highest first)
  .slice(0, 6)
  return (
    <div className="site-page-shell site-page-shell--hidden-overflow">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageStructuredData) }} />

      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>

      {/* HERO SECTION */}
      <style>{`
  .hero-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    align-items: center;
  }

  .hero-text {
    flex: 1 1 500px;
    order: 1;
  }

  .hero-image {
    flex: 1 1 400px;
    order: 2;
  }

  @media (max-width: 768px) {
    .hero-image {
      order: 1;   /* image goes first on mobile */
      flex: 1 1 100%;
    }
    .hero-text {
      order: 2;   /* text goes below on mobile */
      flex: 1 1 100%;
    }
  }
`}</style>

<section style={{ padding: '60px 20px' }}>
  <div className="hero-wrapper">

    <div className="hero-text">
      <p style={{ color: '#B58E58', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '20px', fontWeight: 600 }}>
        STRAIGHT FROM THE HILLS
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', lineHeight: 1.1, margin: 0 }}>
        <span style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, color: '#1E2D24' }}>
          Taste the Himalayas
        </span>
      </h1>
      <p style={{ marginTop: '20px', maxWidth: '450px', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
        Buy pure organic Himalayan products online — Bilona Ghee, Wild Honey, Pahadi Rice,
        and traditional spices. Sourced directly from women farmers in Uttarakhand.
      </p>
      <Link href="/products">
        <button style={{ marginTop: '30px', padding: '16px 36px', background: '#1E2D24', color: '#fff', border: 'none', letterSpacing: '0.1em', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          EXPLORE PRODUCTS <ArrowRight size={16} />
        </button>
      </Link>
    </div>

    <div className="hero-image">
      <ImageCarousel
        images={[
          { src: '/pure_honey.png', alt: 'Himalayan raw honey being poured' },
          { src: '/ghee.png', alt: 'Pure Bilona Ghee' },
          { src: '/pisyu_loon.png', alt: 'Traditional spice grinding with mortar and pestle' },
          { src: '/kaafal.png', alt: 'Kafal himalayan berries' },
          { src: '/bal_mithai.png', alt: 'Choclate Sweet' },
          { src: '/buransh.png', alt: 'Traditional buransh petal juice' },
        ]}
      />
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
             <p>Every jar of SIMDI Ghee comes from Himalayan women farmers who've 
perfected this craft for generations. When you buy from us, you're 
directly supporting 35+ families and preserving mountain agriculture.
</p></div>
            <Link href="/our-roots">
              <button style={{ marginTop: '30px', padding: '14px 32px', background: 'transparent', color: '#1E2D24', border: '1px solid #1E2D24', letterSpacing: '0.1em', fontSize: '0.8rem', cursor: 'pointer' }}>
                READ OUR STORY
              </button>
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />

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
          <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                }}>
            {bestSellers.map((product) => (
                  <ProductCard key={product.$id} product={product} />
                ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/products">
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
