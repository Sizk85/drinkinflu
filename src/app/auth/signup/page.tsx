'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState, Suspense } from 'react'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Wine, Star, ChevronRight } from 'lucide-react'
import { BANGKOK_ZONES } from '@/lib/constants'

function SignUpForm() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role')

  const [step, setStep] = useState(defaultRole ? 2 : 1) // ถ้ามี role ใน URL ข้ามไปขั้นตอน 2
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<string>(defaultRole || '')
  const [isLoading, setIsLoading] = useState(false)

  // Fields for Bar
  const [barName, setBarName] = useState('')
  const [barZone, setBarZone] = useState('')
  const [barMusicStyle, setBarMusicStyle] = useState('')
  const [barLocation, setBarLocation] = useState('')

  // Fields for Influencer
  const [igUsername, setIgUsername] = useState('')
  const [igFollowers, setIgFollowers] = useState('')
  const [city, setCity] = useState('กรุงเทพฯ')
  const [zones, setZones] = useState<string[]>([])

  const handleSelectRole = (selectedRole: string) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload: any = { email, password, name, role }

      // เพิ่มข้อมูลตามบทบาท
      if (role === 'bar') {
        payload.barName = barName
        payload.barZone = barZone
        payload.barLocation = barLocation
        payload.barMusicStyle = barMusicStyle
      } else if (role === 'influencer') {
        payload.igUsername = igUsername
        payload.igFollowers = igFollowers ? parseInt(igFollowers) : 0
        payload.city = city
        payload.zones = zones
      }

      // Create account
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

  const toggleZone = (zone: string) => {
    if (zones.includes(zone)) {
      setZones(zones.filter(z => z !== zone))
    } else {
      setZones([...zones, zone])
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

  // Step 1: เลือกบทบาท
  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">เลือกบทบาทของคุณ</h2>
          <p className="text-muted">คุณต้องการสมัครเป็น?</p>
        </div>

        <div className="grid gap-4">
          <button
            onClick={() => handleSelectRole('influencer')}
            className="glass rounded-2xl p-8 hover:glow-accent transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Star size={32} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">อินฟลูเอนเซอร์</h3>
                  <p className="text-sm text-muted">รับงานจากร้าน โพสต์คอนเทนต์ รับเงิน</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-muted group-hover:text-accent transition-colors" />
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('bar')}
            className="glass rounded-2xl p-8 hover:glow-primary transition-all group text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <Wine size={32} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">ร้านเหล้า / บาร์</h3>
                  <p className="text-sm text-muted">โพสต์งาน หาอินฟลู โปรโมทร้าน</p>
                </div>
              </div>
              <ChevronRight size={24} className="text-muted group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>

        <div className="text-center pt-6">
          <Link href="/auth/signin" className="text-sm text-muted hover:text-accent">
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    )
  }

  // Step 2: กรอกข้อมูล
  return (
    <div className="glass rounded-2xl p-8">
      <div className="mb-6">
        <button
          onClick={() => setStep(1)}
          className="text-sm text-muted hover:text-white flex items-center gap-1"
        >
          ← เปลี่ยนบทบาท
        </button>
        <div className="mt-4 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            role === 'bar' ? 'bg-primary/20' : 'bg-accent/20'
          }`}>
            {role === 'bar' ? (
              <Wine size={24} className="text-primary" />
            ) : (
              <Star size={24} className="text-accent" />
            )}
          </div>
          <div>
            <h3 className="font-bold">
              {role === 'bar' ? 'สมัครสำหรับร้านเหล้า/บาร์' : 'สมัครสำหรับอินฟลูเอนเซอร์'}
            </h3>
            <p className="text-sm text-muted">
              {role === 'bar' ? 'โพสต์งานและหาอินฟลู' : 'รับงานและสร้างรายได้'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ฟิลด์พื้นฐาน */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {role === 'bar' ? 'ชื่อผู้ติดต่อ' : 'ชื่อ-นามสกุล'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'bar' ? 'ชื่อผู้ติดต่อร้าน' : 'ชื่อของคุณ'}
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
          />
        </div>

        {/* ฟิลด์สำหรับ Bar */}
        {role === 'bar' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">ชื่อร้าน</label>
              <input
                type="text"
                value={barName}
                onChange={(e) => setBarName(e.target.value)}
                placeholder="Route 66 Club"
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">โซน</label>
              <select
                value={barZone}
                onChange={(e) => setBarZone(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              >
                <option value="">เลือกโซน</option>
                {BANGKOK_ZONES.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ที่อยู่ร้าน</label>
              <input
                type="text"
                value={barLocation}
                onChange={(e) => setBarLocation(e.target.value)}
                placeholder="123 ถนนสุขุมวิท กรุงเทพฯ"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">สไตล์เพลง</label>
              <input
                type="text"
                value={barMusicStyle}
                onChange={(e) => setBarMusicStyle(e.target.value)}
                placeholder="EDM, Hip Hop, Techno"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </>
        )}

        {/* ฟิลด์สำหรับ Influencer */}
        {role === 'influencer' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">@</span>
                <input
                  type="text"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  placeholder="yourusername"
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">จำนวน Followers (โดยประมาณ)</label>
              <input
                type="number"
                value={igFollowers}
                onChange={(e) => setIgFollowers(e.target.value)}
                placeholder="10000"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">เมือง</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="กรุงเทพฯ"
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">โซนที่สะดวกไปทำงาน (เลือกได้หลายโซน)</label>
              <div className="grid grid-cols-3 gap-2">
                {BANGKOK_ZONES.slice(0, 9).map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => toggleZone(zone)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      zones.includes(zone)
                        ? 'bg-accent text-black font-medium'
                        : 'bg-card border border-border text-muted hover:border-accent'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ฟิลด์ร่วม */}
        <div>
          <label className="block text-sm font-medium mb-2">อีเมล</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
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
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
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

