import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div style={{ backgroundColor: '#F9F7F2', minHeight: '100vh' }}>
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
