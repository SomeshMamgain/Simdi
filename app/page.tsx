import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Mountain, Shield } from 'lucide-react'
import { Suspense } from 'react'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { ProductCard } from '@/components/ProductCard'
import { ImageCarousel } from '@/components/ImageCarousel'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { ReviewsSection } from '@/components/Review/Review'
import { getCanonicalUrl, getSiteUrl } from '@/lib/seo'
import { getProducts } from '@/lib/product-service'

const homepageUrl = getSiteUrl()
const homepageImageUrl = getCanonicalUrl('/ghee.png')
const homepageCommunityImageUrl = getCanonicalUrl('/mahila.jpeg')
const homepageLogoUrl = getCanonicalUrl('/logo.jpeg')

const homepageKeywords = [
  'organic Himalayan products',
  'Uttarakhand organic products',
  'Bilona ghee online',
  'A2 Bilona ghee',
  'wild Himalayan honey',
  'raw honey online',
  'Pahadi rice online',
  'organic mountain products',
  'organic food from Uttarakhand',
  'pure Pahadi products',
  'Himalayan wellness products',
  'Pisyu Loon',
  'Garhwal products',
  'farm to home organic products',
  'chemical free food India',
]
const faqSchema = {
  '@type': 'FAQPage',
  mainEntity: [

    // --- GHEE ---
    {
      '@type': 'Question',
      name: 'What is Bilona ghee and how is it different from regular ghee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bilona ghee is made using the traditional hand-churning (bilona) method: cow milk is first curd-set, then the curd is hand-churned to extract butter, which is then slow-heated into ghee. This process preserves natural A2 proteins, butyric acid, and fat-soluble vitamins. Regular commercial ghee is made by direct cream separation at high speed, which strips out many of these nutrients. SIMDI\'s Pahadi Bilona Cow Ghee follows the original Himalayan method used by women farmers in Pauri Garhwal, Uttarakhand.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between SIMDI Cow Ghee and Buffalo Ghee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIMDI Pahadi Bilona Cow Ghee is lighter, golden-yellow, and made using the traditional bilona hand-churning method — ideal for daily cooking, Ayurvedic use, and easier digestion. SIMDI Buffalo Ghee is richer, creamier, and has a stronger aroma with higher fat content — preferred for deep flavour in curries and sweets. Both are 100% pure, sourced from Himalayan villages in Uttarakhand.',
      },
    },

    // --- HONEY ---
    {
      '@type': 'Question',
      name: 'Is SIMDI honey raw and unprocessed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SIMDI Raw Pahadi Honey is collected from wildflowers and herbs in the untouched hills of Uttarakhand. It is completely raw and unheated, which preserves all natural enzymes, antioxidants, and medicinal properties. Unlike supermarket honey that is heated and filtered to extend shelf life, our honey retains its natural pollen, slight cloudiness, and floral aroma. It is FSSAI certified with no added sugar or preservatives.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does my Pahadi honey crystallise or turn thick?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Crystallisation is a natural sign of pure, raw honey — it is not spoilage. The natural glucose in raw Himalayan honey crystallises over time, especially in cooler temperatures. To liquefy it, simply place the jar in warm water (below 40°C). Never microwave it, as heat destroys the natural enzymes. If honey never crystallises, it has likely been overheated or adulterated.',
      },
    },

    // --- PRODUCTS / WHAT IS ---
    {
      '@type': 'Question',
      name: 'What is Pisyu Loon and how do I use it?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Pisyu Loon is a traditional hand-pounded salt blend from the Uttarakhand Himalayas. "Pisyu" means ground and "Loon" means salt in Garhwali and Kumaoni dialects. It is made by grinding rock salt with local herbs like garlic, green chilli, ginger, cumin, and mustard — giving it a tangy, earthy flavour. Use it as a dip for fresh veggies and fruits, as a seasoning on salads, or as a finishing salt on traditional Pahadi dishes like kafuli and phanu.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Bal Mithai and what does it taste like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bal Mithai is a traditional chocolate-brown sweet from Uttarakhand, especially popular in the Garhwal and Kumaon regions. It is made by slowly caramelising khoya (evaporated milk solids) until it turns dark and fudge-like, then coated with tiny white sugar balls. The taste is rich, mildly sweet, and chocolatey — often described as Pahadi chocolate. SIMDI\'s Bal Mithai is handmade with no preservatives and ships pan-India.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Jhangora (Barnyard Millet) and is it good for fasting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jhangora, also called Barnyard Millet, is a traditional Himalayan grain grown in Uttarakhand. It is gluten-free, rich in fibre and protein, and considered a supergrain. It is widely consumed as a rice substitute and is especially popular during fasting (vrat) days in Hindu households, making it an authentic and nutritious alternative to sabudana. When cooked, it is light and fluffy with a mildly nutty, sweet taste.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Buransh Squash and what are its health benefits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Buransh Squash is a drink made from the vibrant crimson petals of the Rhododendron arboreum flower — the state flower of Uttarakhand. It is naturally cooling, tangy-sweet, and rich in antioxidants. Traditionally consumed in spring and summer, it is believed to support heart health, liver function, and immunity. SIMDI\'s Buransh Squash contains no artificial colour or preservatives — the deep red colour is entirely natural from the flower.',
      },
    },

    // --- TRUST & QUALITY ---
    {
      '@type': 'Question',
      name: 'Are SIMDI products FSSAI certified and lab-tested?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All SIMDI products are FSSAI certified and meet Indian food safety standards. Our honey is lab-tested to verify it contains no added sugar, antibiotics, or adulterants. Our ghee is tested for purity and fat composition. We believe in full transparency — what is on the label is exactly what is in the jar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are SIMDI products chemical-free and organic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All SIMDI products are sourced from the organic-rich mountain soil of Uttarakhand, grown at altitudes above 1,500 metres using traditional farming methods. No pesticides, synthetic fertilisers, or chemical preservatives are used at any stage — from farming to packaging. Many of our seasonal products like Kaafal, Linguda, and Bhatt Dal are wild-harvested or rain-fed, making them naturally chemical-free.',
      },
    },

    // --- SHIPPING & ORDERS ---
    {
      '@type': 'Question',
      name: 'Do you deliver across India? How long does shipping take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, SIMDI delivers pan-India. Most orders are dispatched within 1–2 business days from Chakisain, Pauri Garhwal, Uttarakhand. Delivery typically takes 3–7 business days depending on your location. Metro cities like Delhi, Mumbai, Bangalore, and Pune generally receive orders faster. You will receive a tracking link once your order ships.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is your return or refund policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIMDI stands behind the quality of every product. If you receive a damaged, incorrect, or spoiled item, please contact us at Team@simdi.in within 48 hours of delivery with a photo. We will arrange a replacement or full refund. As our products are perishable food items, we do not accept returns due to change of mind, but we always resolve genuine quality issues.',
      },
    },

    // --- MISSION / COMMUNITY ---
    {
      '@type': 'Question',
      name: 'Who are the women farmers behind SIMDI products?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SIMDI works directly with 35+ women artisans and farmers across 12+ villages in Pauri Garhwal, Uttarakhand — including Chakisain and surrounding hill communities. These women grow, harvest, and handcraft each product using generations-old methods. SIMDI eliminates middlemen so that a fair price reaches the farmers directly. Every purchase you make supports their livelihood and helps preserve traditional mountain agriculture.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I buy SIMDI products as a gift?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. SIMDI products make thoughtful, authentic gifts for people who appreciate pure, natural food. Popular gift choices include our Bilona Ghee, Raw Pahadi Honey, Bal Mithai, Buransh Squash, and Pisyu Loon. We currently ship directly to the gift recipient\'s address. For bulk gifting or corporate orders, contact us at Team@simdi.in or call +91-7042735331.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the shelf life of SIMDI products?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Shelf life varies by product. Bilona Ghee: 12 months from manufacture (store in a cool, dry place). Raw Honey: 18–24 months (store at room temperature, away from direct sunlight). Squash drinks (Buransh, Malta, Seabuckthorn): 6–12 months unopened; consume within 30 days of opening and refrigerate. Dried grains, dals, and spices: 6–12 months in an airtight container. Pickles (Achaar): 6–9 months. All best-before dates are printed on the packaging.',
      },
    },
  ],
}
export const metadata: Metadata = {
  // Primary metadata
  title: 'Pure Himalayan Organic Products | SIMDI - Farm to Home from Uttarakhand',
  description:
    'Shop authentic, pure organic products from Uttarakhand mountains - Raw Bilona Ghee, Wild Honey, Pahadi Rice. FSSAI certified, no chemicals. Support 35+ women farmers.',

  // SEO optimization
  keywords: homepageKeywords,

  // Additional search engine directives
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical URL (prevents duplicate content issues)
  alternates: {
    canonical: homepageUrl,
  },

  // Open Graph (Social Media Sharing) - Critical for conversion
  openGraph: {
    type: 'website',
    url: homepageUrl,
    title: '🏔️ Pure Himalayan Organic Products | SIMDI - Trusted by 500+ Families',
    description:
      '100% pure, raw, unprocessed organic food from Uttarakhand mountains. Lab-tested. Certified. Direct from women farmers. Try today - Money-back guarantee.',
    siteName: 'SIMDI',
    locale: 'en_IN',
    images: [
      {
        url: homepageImageUrl,
        width: 1200,
        height: 630,
        alt: 'SIMDI Himalayan organic products - ghee, honey, rice',
        type: 'image/jpeg',
      },
      {
        url: homepageCommunityImageUrl,
        width: 1200,
        height: 630,
        alt: 'Women farmers of Uttarakhand making pure organic products',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card (X) - For better engagement
  twitter: {
    card: 'summary_large_image',
    site: '@simdi_pahadi',
    creator: '@simdi_pahadi',
    title: 'Pure Himalayan Organic Products Direct from Uttarakhand',
    description:
      'Raw ghee, wild honey, Pahadi rice from mountain women. Pure. Certified. No chemicals. Support farmers.',
    images: [homepageImageUrl],
  },

  // Viewport and mobile optimization
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },

  // Additional metadata for trust signals
  authors: [{ name: 'SIMDI', url: homepageUrl }],
  creator: 'SIMDI',
  publisher: 'SIMDI',

  // Mobile app metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SIMDI - Pahadi Products',
  },

  // Icons
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/`apple-touch-icon`.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  // Verification for search engines (if you have these)
  // verification: {
  //   google: 'your-google-verification-code',
  //   // yandex: 'your-yandex-verification-code',
  // },
}

/**
 * STRUCTURED DATA (JSON-LD) for Rich Snippets
 * This helps Google show richer results in search
 * Include this in your <head> section
 */
export const homepageStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'SIMDI',
      url: homepageUrl,
      logo: homepageLogoUrl,
      description:
        'Pure organic Himalayan products sourced directly from women farmers in Uttarakhand',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chakisain',
        addressLocality: 'Pauri Garhwal',
        addressRegion: 'Uttarakhand',
        postalCode: '246130',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-7042735331',
        contactType: 'Customer Service',
        email: 'team@simdi.in',
      },
      sameAs: [
        'https://www.instagram.com/simdi.in',
        'https://www.facebook.com/SimdiUK12/',
      ],
    },
    {
      '@type': 'LocalBusiness',
      name: 'SIMDI - Himalayan Organic Products',
      image: homepageLogoUrl,
      description:
        'Organic products from Uttarakhand mountains - pure, certified, women-empowered',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Chakisain',
        addressLocality: 'Pauri Garhwal',
        postalCode: '246130',
        addressCountry: 'IN',
      },
      telephone: '+91-7042735331',
      priceRange: '₹119 - ₹2999',
    },
    {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '119',
      highPrice: '2999',
      offerCount: '15+',
      description: 'Organic Himalayan products',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'SIMDI',
          item: homepageUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: getCanonicalUrl('/products'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Our Story',
          item: getCanonicalUrl('/our-roots'),
        },
      ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
          Buy Pure Organic Himalayan Products – Ghee, Honey from Uttarakhand
        </span>
      </h1>
      <p style={{ marginTop: '20px', maxWidth: '450px', color: '#5E6E5E', fontSize: '1rem', lineHeight: 1.7 }}>
        Buy pure organic Himalayan products online — Bilona Ghee, Wild Honey, Pahadi Rice,
        and traditional spices. Sourced directly from women farmers in Uttarakhand.
      </p>
      <TrackedLink
        href="/products"
        eventName="explore_products_click"
        eventParams={{
          category: 'CTA',
          priority: 'secondary',
          page: '/',
        }}
        style={{
          marginTop: '30px',
          padding: '16px 36px',
          background: '#1E2D24',
          color: '#fff',
          border: 'none',
          letterSpacing: '0.1em',
          fontSize: '0.8rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}
      >
        EXPLORE PRODUCTS <ArrowRight size={16} />
      </TrackedLink>
    </div>

    <div className="hero-image">
      <ImageCarousel
        images={[
          { src: '/product_images/pahadi_honey/pahadi_honey.webp', alt: 'Himalayan raw honey being poured' },
          { src: '/product_images/ghee/ghee.webp', alt: 'SIMDI Pure Bilona Ghee – Organic A2 Ghee from Uttarakhand' },
          { src: '/product_images/pisyu_loon/pisyu_loon.webp', alt: 'Traditional spice grinding with mortar and pestle' },
          { src: '/product_images/pahadi_honey/honey3.webp', alt: 'Packed Himalayan honey' },
          { src: '/product_images/kaafal/kaafal.webp', alt: 'Kafal himalayan berries' },
          { src: '/product_images/bal_mithai/bal_mithai.webp', alt: 'Choclate Sweet' },
          { src: '/product_images/buransh/buransh.webp', alt: 'Traditional buransh petal juice' },
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
            <img src="/site_images/born_with_love.webp" alt="Himalyan women feeding cow" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
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
            <TrackedLink
              href="/products"
              eventName="view_all_products_click"
              eventParams={{
                category: 'CTA',
                priority: 'secondary',
                page: '/',
              }}
              style={{
                padding: '14px 40px',
                background: '#1E2D24',
                color: '#fff',
                border: 'none',
                letterSpacing: '0.1em',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                textDecoration: 'none',
              }}
            >
              VIEW ALL PRODUCTS
            </TrackedLink>
          </div>
        </div>
      </section>
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
