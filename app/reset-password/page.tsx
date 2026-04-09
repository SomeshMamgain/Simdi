import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { buildMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export const metadata: Metadata = buildMetadata({
  title: 'Reset Password | Simdi',
  description: 'Reset your Simdi account password securely and regain access to your account.',
  path: '/reset-password',
  index: false,
  follow: false,
  keywords: ['reset password', 'account recovery', 'Simdi login help'],
})

export default function ResetPasswordPage() {
  return (
    <div className="site-page-shell">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
      <Suspense fallback={<div>Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
      <Footer />
    </div>
  )
}
