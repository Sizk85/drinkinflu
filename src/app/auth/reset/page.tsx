'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement password reset functionality
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSuccess(true)
      toast({
        title: 'ส่งอีเมลสำเร็จ!',
        description: 'กรุณาตรวจสอบอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน',
      })
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-md mx-auto px-6 py-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text">รีเซ็ตรหัสผ่าน</h1>
          <p className="text-muted">กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
        </div>

        {isSuccess ? (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-4">ส่งอีเมลสำเร็จ!</h2>
            <p className="text-muted mb-6">
              เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
              <br />
              กรุณาตรวจสอบกล่องจดหมาย
            </p>
            <Link href="/auth/signin">
              <Button className="w-full">กลับไปเข้าสู่ระบบ</Button>
            </Link>
          </div>
        ) : (
          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/signin" className="text-sm text-muted hover:text-accent">
                กลับไปเข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

