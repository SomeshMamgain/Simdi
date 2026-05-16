import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, CheckCircle2, ChevronRight, ShoppingCart } from 'lucide-react'

import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import { blogs, getBlogBySlug, getRelatedBlogs, type Blog, type BlogContentBlock } from '@/lib/blogs'
import { buildMetadata, getAbsoluteAssetUrl, getCanonicalUrl, SITE_NAME } from '@/lib/seo'

type BlogRouteProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata({ params }: BlogRouteProps): Promise<Metadata> {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    return buildMetadata({
      title: 'Blog Not Found | Simdi',
      description: 'The requested Simdi blog article could not be found.',
      path: `/blogs/${slug}`,
      index: false,
      follow: false,
    })
  }

  return buildMetadata({
    title: blog.metaTitle,
    description: blog.metaDescription,
    path: `/blogs/${blog.slug}`,
    type: 'article',
    keywords: blog.keywords,
    images: [blog.image],
    imageAlt: blog.imageAlt,
    publishedTime: blog.publishedAt,
    modifiedTime: blog.publishedAt,
    category: 'Himalayan food and wellness',
  })
}

function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function getBlogPlainText(blog: Blog) {
  return blog.fullContent
    .flatMap((block) => {
      if (block.type === 'paragraph') {
        return [block.text]
      }

      if (block.type === 'section') {
        return [block.title, ...(block.paragraphs ?? []), ...(block.list ?? [])]
      }

      if (block.type === 'benefits') {
        return [block.title, ...block.items.flatMap((item) => [item.title, item.description])]
      }

      if (block.type === 'faq') {
        return [block.title, ...block.items.flatMap((item) => [item.question, item.answer])]
      }

      return []
    })
    .join(' ')
}

function buildBlogPostingSchema(blog: Blog) {
  const canonicalUrl = getCanonicalUrl(`/blogs/${blog.slug}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDescription,
    image: [getAbsoluteAssetUrl(blog.image)],
    datePublished: blog.publishedAt,
    readingTime: '5 min read',
    dateModified: blog.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Simdi Team',
      url: getCanonicalUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Simdi Team',
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteAssetUrl('/logo.jpeg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    articleBody: getBlogPlainText(blog),
  }
}

function buildBreadcrumbSchema(blog: Blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getCanonicalUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogs',
        item: getCanonicalUrl('/blogs'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: getCanonicalUrl(`/blogs/${blog.slug}`),
      },
    ],
  }
}

function getBlogSubject(blog: Blog) {
  const subjectsBySlug: Record<string, string> = {
    'pisyu-loon-pahadi-rock-salt': 'Pisyu Loon',
    'buransh-rhododendron-sharbat': 'Buransh sharbat',
    'kaafal-superfruit': 'Kaafal',
    'pahadi-superfoods': 'A2 Badri Cow Ghee',
  }

  return subjectsBySlug[blog.slug] ?? blog.title
}

function getFirstParagraph(blog: Blog) {
  return blog.fullContent.find((block) => block.type === 'paragraph')?.text ?? blog.excerpt
}

function getSectionParagraph(blog: Blog, index: number) {
  const sections = blog.fullContent.filter((block) => block.type === 'section')
  return sections[index]?.paragraphs?.join(' ') ?? blog.excerpt
}

function getBenefitSummary(blog: Blog) {
  const benefitBlock = blog.fullContent.find((block) => block.type === 'benefits')

  if (!benefitBlock) {
    return blog.excerpt
  }

  return benefitBlock.items
    .slice(0, 3)
    .map((item) => `${item.title}: ${item.description}`)
    .join(' ')
}

function getBlogFaqs(blog: Blog) {
  const faqBlock = blog.fullContent.find((block) => block.type === 'faq')

  if (faqBlock) {
    return faqBlock.items
  }

  const subject = getBlogSubject(blog)

  return [
    {
      question: `What is ${subject}?`,
      answer: getFirstParagraph(blog),
    },
    {
      question: `Where does ${subject} come from?`,
      answer:
        getSectionParagraph(blog, 0) ||
        `${subject} is connected to Uttarakhand's Himalayan food traditions and Simdi's village sourcing network.`,
    },
    {
      question: `How is ${subject} traditionally prepared or sourced?`,
      answer:
        getSectionParagraph(blog, 1) ||
        `${subject} is prepared or sourced in small batches with methods that preserve its traditional Himalayan character.`,
    },
    {
      question: `What makes ${subject} special?`,
      answer: getBenefitSummary(blog),
    },
    {
      question: `Can I buy ${subject} from Simdi?`,
      answer: blog.productHref
        ? `Yes. You can explore ${subject} through Simdi using the ${blog.productCta ?? 'shop'} link on this page.`
        : `You can explore related Himalayan products and stories through Simdi's blog and product collection.`,
    },
  ]
}

function buildFaqSchema(blog: Blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: getBlogFaqs(blog).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

function BlogContent({ block }: { block: BlogContentBlock }) {
  if (block.type === 'paragraph') {
    return (
      <p style={{ fontSize: '1.22rem', color: '#435343', lineHeight: 1.85, margin: '0 0 42px' }}>
        {block.text}
      </p>
    )
  }

  if (block.type === 'image') {
    return (
      <figure style={{ margin: '0 0 64px' }}>
        <img
          src={block.src}
          alt={block.alt}
          style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', borderRadius: '8px' }}
        />
        {block.caption ? (
          <figcaption style={{ color: '#6B756B', fontSize: '0.9rem', marginTop: '12px', textAlign: 'center' }}>
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  if (block.type === 'section') {
    return (
      <section style={{ margin: '0 0 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '36px', alignItems: 'center' }}>
          {block.image ? (
            <img
              src={block.image.src}
              alt={block.image.alt}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : null}
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: '#1E2D24', lineHeight: 1.18, margin: '0 0 24px' }}>
              {block.title}
            </h2>
            {block.paragraphs?.map((paragraph) => (
              <p key={paragraph} style={{ color: '#4D5E4D', fontSize: '1.07rem', lineHeight: 1.9, margin: '0 0 18px' }}>
                {paragraph}
              </p>
            ))}
            {block.list ? (
              <ul style={{ color: '#4D5E4D', fontSize: '1.02rem', lineHeight: 1.85, margin: '24px 0 0', paddingLeft: '22px' }}>
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  if (block.type === 'faq') {
    return (
      <section style={{ margin: '0 0 72px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.7rem)', color: '#1E2D24', lineHeight: 1.18, margin: '0 0 28px' }}>
          {block.title}
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {block.items.map((item) => (
            <article key={item.question} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ color: '#1E2D24', fontSize: '1.08rem', lineHeight: 1.45, margin: '0 0 10px' }}>
                {item.question}
              </h3>
              <p style={{ color: '#5E6E5E', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: '8px', padding: 'clamp(28px, 5vw, 56px)', margin: '0 0 72px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: '#1E2D24', textAlign: 'center', margin: '0 0 36px' }}>
        {block.title}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {block.items.map((item) => (
          <div key={item.title} style={{ display: 'flex', gap: '14px' }}>
            <CheckCircle2 color="#B58E58" size={22} style={{ flexShrink: 0, marginTop: '3px' }} />
            <div>
              <h3 style={{ color: '#1E2D24', fontSize: '1rem', margin: '0 0 6px' }}>{item.title}</h3>
              <p style={{ color: '#5E6E5E', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default async function BlogDetailPage({ params }: BlogRouteProps) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  const relatedBlogs = getRelatedBlogs(blog.slug, 3)
  const faqs = getBlogFaqs(blog)

  return (
    <div className="site-page-shell">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildBlogPostingSchema(blog)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildBreadcrumbSchema(blog)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(buildFaqSchema(blog)) }}
      />

      <main style={{ maxWidth: '1120px', margin: '0 auto', padding: '50px 20px 96px' }}>
        <nav aria-label="Breadcrumb" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', color: '#6B756B', fontSize: '0.9rem', marginBottom: '36px' }}>
          <Link href="/" style={{ color: '#6B756B', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/blogs" style={{ color: '#6B756B', textDecoration: 'none' }}>Blogs</Link>
          <ChevronRight size={14} />
          <span>{blog.title}</span>
        </nav>

        <article>
          <header style={{ maxWidth: '920px', margin: '0 auto 56px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#B58E58', fontWeight: 800, fontSize: '0.82rem', marginBottom: '18px' }}>
              <Calendar size={15} />
              <time dateTime={blog.publishedAt}>{blog.date}</time>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.45rem, 6vw, 4.35rem)', color: '#1E2D24', lineHeight: 1.08, margin: '0 0 24px' }}>
              {blog.title}
            </h1>
            <p style={{ color: '#5E6E5E', fontSize: '1.22rem', lineHeight: 1.75, margin: 0 }}>
              {blog.excerpt}
            </p>
          </header>

          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            {blog.fullContent.filter((block) => block.type !== 'faq').map((block, index) => (
              <BlogContent key={`${block.type}-${index}`} block={block} />
            ))}
          </div>
        </article>

        {/* <section style={{ maxWidth: '980px', margin: '0 auto 80px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#1E2D24', fontSize: 'clamp(2rem, 4vw, 2.5rem)', margin: '0 0 26px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {faqs.map((faq) => (
              <article key={faq.question} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: '8px', padding: '24px' }}>
                <h3 style={{ color: '#1E2D24', fontSize: '1.08rem', lineHeight: 1.45, margin: '0 0 10px' }}>
                  {faq.question}
                </h3>
                <p style={{ color: '#5E6E5E', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section> */}

        {blog.productHref ? (
          <section style={{ background: '#1E2D24', color: '#fff', textAlign: 'center', borderRadius: '8px', padding: '56px 24px', margin: '8px auto 80px', maxWidth: '980px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 4vw, 2.6rem)', margin: '0 0 14px' }}>
              Bring This Himalayan Story Home
            </h2>
            <p style={{ color: '#C8D2C8', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 auto 28px', maxWidth: '680px' }}>
              Explore authentic products from Simdi's village network and taste the traditions behind the article.
            </p>
            <Link
              href={blog.productHref}
              style={{ background: '#B58E58', color: '#fff', padding: '16px 28px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', fontWeight: 800 }}
            >
              <ShoppingCart size={20} />
              {blog.productCta ?? 'Shop Products'}
            </Link>
          </section>
        ) : null}

        <section style={{ marginTop: '88px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#1E2D24', fontSize: '2.25rem', margin: '0 0 28px' }}>
            Related Blogs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {relatedBlogs.map((relatedBlog) => (
              <article key={relatedBlog.id} style={{ background: '#fff', border: '1px solid #E8E4D9', borderRadius: '8px', overflow: 'hidden' }}>
                <Link href={`/blogs/${relatedBlog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <img
                    src={relatedBlog.image}
                    alt={relatedBlog.imageAlt}
                    style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '22px' }}>
                    <p style={{ color: '#B58E58', fontSize: '0.82rem', fontWeight: 800, margin: '0 0 10px' }}>{relatedBlog.date}</p>
                    <h3 style={{ color: '#1E2D24', fontSize: '1.2rem', lineHeight: 1.35, margin: '0 0 12px' }}>{relatedBlog.title}</h3>
                    <p style={{ color: '#5E6E5E', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>{relatedBlog.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
