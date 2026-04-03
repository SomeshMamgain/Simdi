import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="site">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <p style={{ color: '#B58E58', letterSpacing: '0.2em', fontSize: '0.75rem', marginBottom: '16px' }}>
            STRAIGHT FROM THE HILLS
          </p>
          <h1>
            <span style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Crafted by Mountains.</span>
            <span style={{ display: 'block', fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)', color: '#B58E58', marginTop: '8px' }}>
              Untouched by Cities
            </span>
          </h1>
          <p style={{ maxWidth: '580px', margin: '1rem auto 1.5rem', lineHeight: 1.6, color: '#546056' }}>
            Premium Himalayan products sourced directly from Uttarakhand villages, building local incomes and preserving heritage.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="btn btn-primary" href="/products">Explore Himalayan Products</a>
            <a className="btn btn-secondary" href="/about">Our Story</a>
          </div>
        </div>
      </section>

      <main>
        <section className="section" id="features">
          <h2>Why Customers Love Simdi</h2>
          <div className="grid-3">
            <article className="card">
              <h3>Authentic Heritage</h3>
              <p>Each product is crafted by Himalayan artisans using traditional methods passed down across generations.</p>
            </article>
            <article className="card">
              <h3>Sustainable Sourcing</h3>
              <p>We partner with communities to protect biodiversity and ensure ethical harvesting and fair income.</p>
            </article>
            <article className="card">
              <h3>Premium Quality</h3>
              <p>Strict quality checks guarantee fresh, natural, and safe products for everyday home use.</p>
            </article>
          </div>
        </section>

        <section className="section featured">
          <h2>Our Best Sellers</h2>
          <div className="grid-4">
            {[
              { icon: '🍵', name: 'Organic Pahadi Ghee', price: '₹799' },
              { icon: '🍯', name: 'Raw Wild Honey', price: '₹649' },
              { icon: '🌾', name: 'Pahadi Red Rice', price: '₹349' },
              { icon: '🧂', name: 'Traditional Pisyu Loon', price: '₹199' },
            ].map((p) => (
              <div key={p.name} className="product-card">
                <div className="product-icon">{p.icon}</div>
                <strong>{p.name}</strong>
                <p style={{ color: '#B58E58', fontWeight: 700 }}>{p.price}</p>
                <a className="btn btn-primary" href="/products">Add to Cart</a>
              </div>
            ))}
          </div>
        </section>

        <section className="section blog-preview">
          <h2>From the Simdi Journal</h2>
          <div className="grid-3">
            <article className="card">
              <h3>Himalayan Tea Traditions</h3>
              <p>Explore the age-old methods behind Lahariya tea and its health-giving properties.</p>
              <a href="/blog">Read More</a>
            </article>
            <article className="card">
              <h3>Ethical Honey Collection</h3>
              <p>How we preserve honeybees and support village co-ops with transparent sourcing.</p>
              <a href="/blog">Read More</a>
            </article>
            <article className="card">
              <h3>Crafting with Purpose</h3>
              <p>Stories of artisans reviving traditional weaving and pottery skills through Simdi.</p>
              <a href="/blog">Read More</a>
            </article>
          </div>
        </section>

        <section className="section newsletter">
          <h2>Join the Simdi Community</h2>
          <p>Sign up for authentic collections, artisan stories, and advance tasting offers.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="you@example.com" aria-label="Email" required />
            <button className="btn btn-secondary" type="button">Subscribe</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
