import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function InfluencerJobsPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">งานของฉัน</h1>
        
        <div className="glass rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-4">งานของคุณ</h2>
          <p className="text-muted mb-6">รายการงานที่คุณรับทั้งหมด</p>
          <Link href="/explore">
            <Button>ค้นหางานใหม่</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

