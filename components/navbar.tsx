import Link from 'next/link'

export function Navbar() {
  return (
    <header className="site-header">
      <div className="brand">
        SIMDI <span className="brand-sub">PAHADI</span>
      </div>
      <nav className="site-nav">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">Our Roots</Link>
        <Link href="/account">Account</Link>
      </nav>
    </header>
  )
}
