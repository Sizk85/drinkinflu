'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">แก้ไขโปรไฟล์</h1>
        
        <div className="glass rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">ชื่อ</label>
            <input
              type="text"
              placeholder="ชื่อของคุณ"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              placeholder="เกี่ยวกับคุณ"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
            />
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => router.back()}>
              ยกเลิก
            </Button>
            <Button className="flex-1">บันทึก</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

