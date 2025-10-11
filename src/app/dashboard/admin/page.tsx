import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, DollarSign, TrendingUp } from 'lucide-react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/dashboard')
  }

  // TODO: Fetch real data from API
  const stats = {
    totalUsers: 542,
    totalJobs: 1245,
    platformRevenue: 245800,
    activeJobs: 28,
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
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted mt-2">ร้าน + อินฟลู</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <Briefcase className="text-accent" size={24} />
              <span className="text-xs text-muted">งานทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted mt-2">
              {stats.activeJobs} งานกำลังเปิด
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="text-green-500" size={24} />
              <span className="text-xs text-muted">รายได้แพลตฟอร์ม</span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              ฿{stats.platformRevenue.toLocaleString()}
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
          <Button className="h-16">
            👥 จัดการผู้ใช้
          </Button>
          <Button variant="outline" className="h-16">
            📋 ตรวจสอบงาน
          </Button>
          <Button variant="outline" className="h-16">
            💰 ธุรกรรม
          </Button>
          <Button variant="outline" className="h-16">
            📊 รายงาน
          </Button>
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

