'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Wallet, Calendar, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { formatCurrency } from '@/lib/pricing'
import { formatJobDate } from '@/lib/date-utils'

export default function InfluencerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    walletBalance: 0,
    totalJobs: 0,
    rating: 0,
    totalEarnings: 0,
  })
  const [upcomingJobs, setUpcomingJobs] = useState<any[]>([])
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

      // Fetch applications (งานที่รับ)
      const appsRes = await fetch('/api/applications')
      const appsData = await appsRes.json()
      
      const acceptedJobs = appsData.applications?.filter((app: any) => 
        app.status === 'accepted' || app.status === 'completed'
      ) || []

      // Fetch transactions for total earnings
      const txRes = await fetch('/api/wallet/transactions')
      const txData = await txRes.json()
      const totalEarnings = txData.transactions
        ?.filter((tx: any) => tx.type === 'job_received')
        .reduce((sum: number, tx: any) => sum + parseFloat(tx.amount), 0) || 0

      setStats({
        walletBalance: balanceData.balance || 0,
        totalJobs: acceptedJobs.length,
        rating: 4.8, // TODO: คำนวณจาก reviews
        totalEarnings,
      })

      // Get upcoming jobs
      const upcomingApps = appsData.applications?.filter((app: any) => 
        app.status === 'accepted' && app.verificationStatus !== 'approved'
      ).slice(0, 5) || []
      
      setUpcomingJobs(upcomingApps)
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
          <h1 className="text-4xl font-bold mb-2 neon-text">แดชบอร์ดอินฟลูเอนเซอร์</h1>
          <p className="text-muted">ยินดีต้อนรับกลับมา!</p>
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
              <Button size="sm" className="w-full mt-3">ถอนเงิน</Button>
            </Link>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="text-accent" size={24} />
              <span className="text-xs text-muted">งานทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted mt-2">งานที่เสร็จสิ้น</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Star className="text-yellow-500" size={24} />
              <span className="text-xs text-muted">เรตติ้ง</span>
            </div>
            <div className="text-3xl font-bold">{stats.rating}</div>
            <p className="text-xs text-muted mt-2">จาก 5.0</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="text-green-500" size={24} />
              <span className="text-xs text-muted">รายได้รวม</span>
            </div>
            <div className="text-3xl font-bold">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <p className="text-xs text-muted mt-2">ตลอดเวลา</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/explore">
            <Button className="w-full h-20 text-lg">
              ค้นหางานใหม่
            </Button>
          </Link>
          <Link href="/verify">
            <Button variant="outline" className="w-full h-20 text-lg">
              ส่งหลักฐานโพสต์
            </Button>
          </Link>
          <Link href="/profiles/me">
            <Button variant="outline" className="w-full h-20 text-lg">
              แก้ไขโปรไฟล์
            </Button>
          </Link>
        </div>

        {/* Upcoming Jobs */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">งานที่กำลังจะมาถึง</h2>
            <Link href="/dashboard/influencer/jobs">
              <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
            </Link>
          </div>

          {upcomingJobs.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>ไม่มีงานที่กำลังจะมาถึง</p>
              <Link href="/explore">
                <Button className="mt-4">ค้นหางาน</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingJobs.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                  <div>
                    <h3 className="font-bold mb-1">งาน #{app.jobId?.slice(0, 8)}</h3>
                    <p className="text-sm text-muted">
                      {app.status === 'accepted' ? 'รับงานแล้ว' : app.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {app.paymentAmount ? formatCurrency(app.paymentAmount) : '-'}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-500">
                      {app.verificationStatus || 'pending'}
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

