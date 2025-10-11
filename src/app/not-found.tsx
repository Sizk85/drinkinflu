import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-9xl font-bold neon-text mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">ไม่พบหน้าที่คุณต้องการ</h1>
        <p className="text-xl text-muted mb-8">
          หน้านี้อาจถูกลบ หรือ URL ไม่ถูกต้อง
        </p>
        <Link href="/">
          <Button size="lg">กลับหน้าหลัก</Button>
        </Link>
      </div>
    </div>
  )
}

