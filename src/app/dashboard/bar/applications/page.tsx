import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function BarApplicationsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">ผู้สมัครงาน</h1>
        
        <div className="glass rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">รายการผู้สมัคร</h2>
          <p className="text-muted mb-6">ดูและอนุมัติผู้สมัครงานของคุณ</p>
          <Link href="/dashboard/bar">
            <Button variant="outline">กลับแดชบอร์ด</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

