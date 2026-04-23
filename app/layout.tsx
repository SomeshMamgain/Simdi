import type { Metadata } from 'next'
import Script from 'next/script'
import { Merriweather, Open_Sans } from 'next/font/google'
import { AuthProvider } from '@/components/providers/auth-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { SITE_NAME, SITE_TAGLINE, defaultKeywords, getMetadataBase } from '@/lib/seo'
import './globals.css'

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: SITE_NAME,
  description:
    'SIMDI brings authentic Himalayan products, mountain-rooted stories, and trusted support inspired by Uttarakhand.',
  applicationName: SITE_NAME,
  keywords: defaultKeywords,
  category: 'food',
  // Yahan verification code add kar diya hai
  verification: {
    google: 'z0vgQDwjFBMqSmCPWDTpYgiz2i_ltvwVkV0VW-Z98pw',
  },
  openGraph: {
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'Discover authentic Pahadi products, Himalayan pantry staples, and mountain-rooted stories from Uttarakhand.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description:
      'Discover authentic Pahadi products, Himalayan pantry staples, and mountain-rooted stories from Uttarakhand.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${openSans.variable}`}>
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://googletagmanager.com;
          f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-5MTGHP44');
        `}
      </Script>
      <Script id="gtag-shim" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
        `}
      </Script>
      <Script
        async
        src="https://googlesyndication.com"
        strategy="afterInteractive"
      />
      <body>
        <noscript>
          <iframe
            src="https://googletagmanager.com"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
