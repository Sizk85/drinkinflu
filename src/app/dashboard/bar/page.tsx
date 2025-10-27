'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Wallet, Briefcase, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/pricing'
import { formatJobDate } from '@/lib/date-utils'

export default function BarDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    walletBalance: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalSpent: 0,
  })
  const [activeJobs, setActiveJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      fetchDashboardData()
    }
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch wallet balance
      const balanceRes = await fetch('/api/wallet/balance')
      const balanceData = await balanceRes.json()

      // Fetch jobs
      const jobsRes = await fetch('/api/jobs?status=open')
      const jobsData = await jobsRes.json()

      // Fetch applications count
      const appsRes = await fetch('/api/applications')
      const appsData = await appsRes.json()

      // Fetch transactions for total spent
      const txRes = await fetch('/api/wallet/transactions')
      const txData = await txRes.json()
      const totalSpent = txData.transactions
        ?.filter((tx: any) => parseFloat(tx.amount) < 0)
        .reduce((sum: number, tx: any) => sum + Math.abs(parseFloat(tx.amount)), 0) || 0

      setStats({
        walletBalance: balanceData.balance || 0,
        activeJobs: jobsData.jobs?.length || 0,
        totalApplications: appsData.applications?.filter((app: any) => app.status === 'pending').length || 0,
        totalSpent,
      })

      setActiveJobs(jobsData.jobs?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
          <h1 className="text-4xl font-bold mb-2 neon-text">แดชบอร์ดร้านเหล้า/บาร์</h1>
          <p className="text-muted">จัดการงานและอินฟลูของคุณ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Wallet className="text-primary" size={24} />
              <span className="text-xs text-muted">ยอดคงเหลือ</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(stats.walletBalance)}
            </div>
            <Link href="/wallet">
              <Button size="sm" className="w-full mt-3">เติมเงิน</Button>
            </Link>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Briefcase className="text-accent" size={24} />
              <span className="text-xs text-muted">งานที่เปิดอยู่</span>
            </div>
            <div className="text-3xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted mt-2">กำลังรับสมัคร</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="text-green-500" size={24} />
              <span className="text-xs text-muted">ผู้สมัคร</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted mt-2">รอการตรวจสอบ</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="text-yellow-500" size={24} />
              <span className="text-xs text-muted">ใช้จ่ายทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.totalSpent)}
            </div>
            <p className="text-xs text-muted mt-2">ตลอดเวลา</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/post-job">
            <Button className="w-full h-20 text-lg">
              โพสต์งานใหม่
            </Button>
          </Link>
          <Link href="/dashboard/bar/applications">
            <Button variant="outline" className="w-full h-20 text-lg">
              ดูผู้สมัคร
            </Button>
          </Link>
          <Link href="/profiles/me">
            <Button variant="outline" className="w-full h-20 text-lg">
              แก้ไขโปรไฟล์
            </Button>
          </Link>
        </div>

        {/* Active Jobs */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">งานที่เปิดอยู่</h2>
            <Link href="/dashboard/bar/jobs">
              <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
            </Link>
          </div>

          {activeJobs.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีงานที่เปิดอยู่</p>
              <Link href="/post-job">
                <Button className="mt-4">โพสต์งานแรก</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                  <div>
                    <h3 className="font-bold mb-1">{job.title}</h3>
                    <p className="text-sm text-muted">{formatJobDate(job.date)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {job.acceptedCount || 0}/{job.requiredCount || 1} คน
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-500">
                      {job.status === 'open' ? 'เปิดรับสมัคร' : job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

