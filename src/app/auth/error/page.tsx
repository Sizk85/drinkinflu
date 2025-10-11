'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'เกิดข้อผิดพลาดในการตั้งค่าระบบ กรุณาติดต่อผู้ดูแล',
    AccessDenied: 'คุณไม่มีสิทธิ์เข้าถึง',
    Verification: 'ไม่สามารถยืนยันตัวตนได้',
    Default: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-md mx-auto px-6 py-24">
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-muted mb-8">
            {error ? errorMessages[error] || errorMessages.Default : errorMessages.Default}
          </p>
          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full">ลองเข้าสู่ระบบอีกครั้ง</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">กลับหน้าหลัก</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">กำลังโหลด...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}

