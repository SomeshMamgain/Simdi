import type { Metadata } from 'next'
import { Merriweather, Open_Sans } from 'next/font/google'
import { QueryProvider } from '@/components/providers/query-provider'
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
  title: 'Simdi',
  description: 'Simdi app is live'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${openSans.variable}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
