import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { BarChart3, Star, Shield } from 'lucide-react'

export default function DashboardPage() {
  // TODO: Get user role from session
  const userRole = 'guest' // In production, get from NextAuth session

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 neon-text">
            เลือกบทบาทของคุณ
          </h1>
          <p className="text-xl text-muted">
            คุณต้องการเข้าใช้งานในฐานะใด?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Influencer Dashboard */}
          <Link href="/dashboard/influencer">
            <div className="glass rounded-2xl p-8 hover:glow-accent transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4 group-hover:glow-accent">
                  <Star size={32} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">อินฟลูเอนเซอร์</h3>
                <p className="text-sm text-muted mb-4">
                  ค้นหางาน ส่งหลักฐาน ถอนเงิน
                </p>
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black w-full">
                  เข้าสู่แดชบอร์ด
                </Button>
              </div>
            </div>
          </Link>

          {/* Bar Dashboard */}
          <Link href="/dashboard/bar">
            <div className="glass rounded-2xl p-8 hover:glow-primary transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary">
                  <BarChart3 size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">ร้านเหล้า/บาร์</h3>
                <p className="text-sm text-muted mb-4">
                  โพสต์งาน จัดการ ตรวจสอบ
                </p>
                <Button className="w-full">
                  เข้าสู่แดชบอร์ด
                </Button>
              </div>
            </div>
          </Link>

          {/* Admin Dashboard */}
          <Link href="/dashboard/admin">
            <div className="glass rounded-2xl p-8 hover:glow-primary transition-all cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary">
                  <Shield size={32} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">ผู้ดูแลระบบ</h3>
                <p className="text-sm text-muted mb-4">
                  จัดการทั้งหมด Analytics
                </p>
                <Button variant="outline" className="w-full">
                  เข้าสู่แดชบอร์ด
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

