import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 grain-overlay overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
          ตัวกลาง<span className="text-accent">เจ้าใหญ่</span>
          <br />
          ร้านเหล้า × อินฟลู
        </h1>
        
        <p className="text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto">
          แพลตฟอร์มที่เชื่อมร้านเหล้า/บาร์กับอินฟลูเอนเซอร์<br />
          โพสต์งาน รับงาน ตรวจ AI จ่ายเงิน ครบในที่เดียว 🎉
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/signup?role=bar">
            <Button size="lg" className="text-lg px-10 py-6 h-auto">
              สำหรับร้านเหล้า
            </Button>
          </Link>
          <Link href="/auth/signup?role=influencer">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-6 h-auto border-accent text-accent hover:bg-accent hover:text-black"
            >
              สำหรับอินฟลู
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted">ร้านค้าที่ไว้วางใจ</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">2,000+</div>
            <div className="text-sm text-muted">อินฟลูในระบบ</div>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted">งานที่สำเร็จ</div>
          </div>
        </div>
      </div>
    </section>
  )
}

