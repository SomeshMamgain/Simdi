import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

const allBlogs = [
  {
    id: 1,
    title: "Why Himalayan Superfoods are the Future of Nutrition",
    slug: "pahadi-superfoods",
    date: "April 3, 2026",
    excerpt: "Discover the hidden health secrets of Mandua, Jakhiya, and Badri Ghee from Uttarakhand.",
    image: "/simdi.jpg"
  }
];

export default function BlogIndex() {
  return (
    <div style={{ background: '#F9F7F2', minHeight: '100vh' }}>
      <Navbar />
      <header style={{ padding: '100px 20px 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '3.5rem', color: '#1E2D24' }}>Simdi Chronicles</h1>
        <p style={{ color: '#B58E58', fontSize: '1.2rem', fontStyle: 'italic' }}>Stories of Purity, Tradition, and the Hills</p>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
          {allBlogs.map(blog => (
            <div key={blog.id} style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img src={blog.image} style={{ width: '100%', height: '250px', objectFit: 'cover' }} alt={blog.title} />
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#B58E58', fontSize: '0.8rem', marginBottom: '15px' }}>
                  <Calendar size={14} /> {blog.date}
                </div>
                <h2 style={{ fontFamily: 'Georgia', fontSize: '1.5rem', color: '#1E2D24', marginBottom: '15px' }}>{blog.title}</h2>
                <p style={{ color: '#5E6E5E', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '25px' }}>{blog.excerpt}</p>
                <Link href={`/blogs/${blog.slug}`} style={{ color: '#1E2D24', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  Read Story <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}