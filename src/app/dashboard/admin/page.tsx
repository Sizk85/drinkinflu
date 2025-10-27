'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, DollarSign, TrendingUp, Settings, FileText } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    users: { total: 0, influencers: 0, bars: 0, newThisMonth: 0 },
    jobs: { total: 0, active: 0, completed: 0, newThisMonth: 0 },
    bookings: { total: 0, active: 0 },
    revenue: { platform: 0, paidToInfluencers: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    if (session?.user) {
      fetchStats()
    }
  }, [session, status, router])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-muted">ภาพรวมแพลตฟอร์ม 🛡️</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="text-primary" size={24} />
              <span className="text-xs text-muted">ผู้ใช้ทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold">{stats.users.total}</div>
            <p className="text-xs text-muted mt-2">ร้าน + อินฟลู</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Briefcase className="text-accent" size={24} />
              <span className="text-xs text-muted">งานทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold">{stats.jobs.total}</div>
            <p className="text-xs text-muted mt-2">
              {stats.jobs.active} งานกำลังเปิด
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="text-green-500" size={24} />
              <span className="text-xs text-muted">รายได้แพลตฟอร์ม</span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              ฿{stats.revenue.platform.toLocaleString()}
            </div>
            <p className="text-xs text-muted mt-2">คอมมิชชัน 15%</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="text-yellow-500" size={24} />
              <span className="text-xs text-muted">เติบโต</span>
            </div>
            <div className="text-3xl font-bold text-yellow-500">+24%</div>
            <p className="text-xs text-muted mt-2">เทียบเดือนที่แล้ว</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Link href="/dashboard/admin/users">
            <Button className="h-16 w-full">
              <Users size={18} className="mr-2" />
              จัดการผู้ใช้
            </Button>
          </Link>
          <Link href="/dashboard/admin/verifications">
            <Button variant="outline" className="h-16 w-full">
              <FileText size={18} className="mr-2" />
              ตรวจสอบงาน
            </Button>
          </Link>
          <Link href="/dashboard/admin/transactions">
            <Button variant="outline" className="h-16 w-full">
              <DollarSign size={18} className="mr-2" />
              ประวัติธุรกรรม
            </Button>
          </Link>
          <Link href="/api/admin/stats" target="_blank">
            <Button variant="outline" className="h-16 w-full">
              <TrendingUp size={18} className="mr-2" />
              ดูสถิติ API
            </Button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">ผู้ใช้ใหม่ล่าสุด</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-card rounded-xl">
                <span>bella@influ.com (Influencer)</span>
                <span className="text-muted">5 นาทีที่แล้ว</span>
              </div>
              <div className="flex justify-between p-3 bg-card rounded-xl">
                <span>demon@bar.com (Bar)</span>
                <span className="text-muted">12 นาทีที่แล้ว</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">งานที่ต้องตรวจสอบ</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 bg-card rounded-xl">
                <span>Techno Night @ Demon Bar</span>
                <Button size="sm">ตรวจสอบ</Button>
              </div>
              <div className="flex justify-between p-3 bg-card rounded-xl">
                <span>Weekend Party @ Illuzion</span>
                <Button size="sm">ตรวจสอบ</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

