import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Simdi',
  description: 'Simdi app is live'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
