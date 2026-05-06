import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'
import { blogs } from '@/lib/blogs'

export const metadata: Metadata = buildMetadata({
  title: 'Blogs | Simdi',
  description:
    'Read SIMDI blog articles on Himalayan superfoods, traditional Pahadi ingredients, wellness, and the stories behind our Uttarakhand roots.',
  path: '/blogs',
  keywords: [
    'Simdi blog',
    'Himalayan superfoods blog',
    'Pahadi food articles',
    'Uttarakhand wellness blog',
    'Badri ghee guide',
  ],
  images: ['/himalayan.png'],
  imageAlt: 'SIMDI blog covering Himalayan products and wellness',
})

export default function BlogIndex() {
  return (
    <div className="site-page-shell">
      <Navbar />
      <header style={{ padding: '100px 20px 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', color: '#1E2D24' }}>Simdi Chronicles</h1>
        <p style={{ color: '#B58E58', fontSize: '1.2rem', fontStyle: 'italic' }}>Stories of Purity, Tradition, and the Hills</p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {blogs.map(blog => (
            <article key={blog.id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img src={blog.image} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt={blog.imageAlt} />
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B58E58', fontSize: '0.8rem', marginBottom: '15px' }}>
                  <Calendar size={14} /> <time dateTime={blog.publishedAt}>{blog.date}</time>
                </div>
                <h2 style={{ fontFamily: 'Georgia', fontSize: '1.5rem', color: '#1E2D24', marginBottom: '15px' }}>{blog.title}</h2>
                <p style={{ color: '#5E6E5E', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px' }}>{blog.excerpt}</p>
                <Link href={`/blogs/${blog.slug}`} style={{ color: '#1E2D24', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Read Story <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
