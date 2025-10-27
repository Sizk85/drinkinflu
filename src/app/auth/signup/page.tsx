'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState, Suspense } from 'react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

function SignUpForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'influencer'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState(defaultRole)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาด')
      }

      toast({
        title: 'สมัครสมาชิกสำเร็จ!',
        description: 'กำลังเข้าสู่ระบบ...',
      })

      // Auto sign in after signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถสมัครสมาชิกได้',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถสมัครด้วย Google ได้',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="glass rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">คุณคือ?</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              >
                <option value="influencer">อินฟลูเอนเซอร์</option>
                <option value="bar">ร้านเหล้า/บาร์</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {role === 'bar' ? 'ชื่อร้าน' : 'ชื่อ-นามสกุล'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'bar' ? 'ชื่อร้านของคุณ' : 'ชื่อของคุณ'}
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              />
              <p className="text-xs text-muted mt-1">ต้องมีอย่างน้อย 8 ตัวอักษร</p>
            </div>

            <div className="text-sm">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="rounded accent-primary mt-1" />
                <span className="text-muted">
                  ฉันยอมรับ{' '}
                  <Link href="/legal/terms" className="text-primary hover:underline">
                    ข้อกำหนดและเงื่อนไข
                  </Link>
                  {' '}และ{' '}
                  <Link href="/legal/privacy" className="text-primary hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </span>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center text-sm text-muted mb-4">หรือสมัครด้วย</div>
            <div className="grid gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                disabled
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                Instagram (เร็วๆ นี้)
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                type="button"
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
            </div>
          </div>
        </div>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text">สมัครสมาชิก</h1>
          <p className="text-muted">เข้าร่วมกับเราวันนี้!</p>
        </div>

        <Suspense fallback={
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-muted">กำลังโหลด...</div>
          </div>
        }>
          <SignUpForm />
        </Suspense>
      </div>
    </div>
  )
}

