import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
        {/* New: Seat Keeper Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🪑</div>
            <h2 className="text-4xl font-bold mb-4 neon-text">
              NEW! Seat Keeper
            </h2>
            <p className="text-xl text-muted mb-8 max-w-3xl mx-auto">
              ไม่ต้องกลัวไม่มีโต๊ะ! มีคนนั่งรอคุณอยู่แล้ว<br />
              หรืออยากหารายได้เสริม? สมัครเป็น Seat Keeper รับเงิน 150฿/ชม.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seat-booking">
                <Button size="lg" className="text-lg px-8">
                  🪑 จองโต๊ะ (ลูกค้า)
                </Button>
              </Link>
              <Link href="/seat-keeper">
                <Button size="lg" variant="outline" className="text-lg px-8 border-accent text-accent hover:bg-accent hover:text-black">
                  💰 สมัครเป็น Keeper
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

        {/* Value Propositions */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 neon-text">
            ทำไมต้อง DrinkInflu?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Bars */}
            <div className="glass rounded-2xl p-8 hover:glow-primary transition-all">
              <div className="text-5xl mb-4">🍸</div>
              <h3 className="text-2xl font-bold mb-4 text-primary">สำหรับร้านเหล้า/บาร์</h3>
              <ul className="space-y-3 text-muted">
                <li>✅ โพสต์งานง่าย คำนวณต้นทุนอัตโนมัติ</li>
                <li>✅ เลือกอินฟลูที่ใช่ ดูสถิติจริง</li>
                <li>✅ AI ตรวจโพสต์ ไม่ต้องคอยเช็ค</li>
                <li>✅ จ่ายผ่าน Wallet ปลอดภัย</li>
              </ul>
              <Link href="/post-job">
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                  เริ่มโพสต์งาน
                </Button>
              </Link>
            </div>

            {/* For Influencers */}
            <div className="glass rounded-2xl p-8 hover:glow-accent transition-all">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-4 text-accent">สำหรับอินฟลูเอนเซอร์</h3>
              <ul className="space-y-3 text-muted">
                <li>✅ หางานง่าย ฟิลเตอร์ตามโซนที่สะดวก</li>
                <li>✅ รับเงินไว ถอนง่าย</li>
                <li>✅ สร้างโปรไฟล์ โชว์ผลงาน</li>
                <li>✅ ระบบรีวิว สร้างชื่อเสียง</li>
              </ul>
              <Link href="/explore">
                <Button variant="outline" className="w-full mt-6 border-accent text-accent hover:bg-accent hover:text-black">
                  ค้นหางาน
                </Button>
              </Link>
            </div>

            {/* For Teams/Moms */}
            <div className="glass rounded-2xl p-8 hover:glow-primary transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-4 text-primary">สำหรับโม/ทีม</h3>
              <ul className="space-y-3 text-muted">
                <li>✅ จัดการทีมในที่เดียว</li>
                <li>✅ แบ่งส่วนแบ่งอัตโนมัติ</li>
                <li>✅ แจกงานให้ลูกทีม</li>
                <li>✅ ดูรายได้รวมทั้งทีม</li>
              </ul>
              <Link href="/teams">
                <Button variant="outline" className="w-full mt-6">
                  สร้างทีม
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 neon-text">
            ใช้งานง่ายเพียง 3 ขั้นตอน
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-primary">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">โพสต์งาน / หางาน</h3>
              <p className="text-muted">
                ร้านโพสต์งานพร้อมเงื่อนไข<br />
                อินฟลูเลือกงานที่ชอบ
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6 glow-accent">
                <span className="text-3xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">ไปงาน ส่งหลักฐาน</h3>
              <p className="text-muted">
                อินฟลูไปร้าน โพสต์ตามเงื่อนไข<br />
                ส่งสกรีนสตอรี่ให้ระบบตรวจ
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6 glow-primary">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">รับเงิน รีวิว</h3>
              <p className="text-muted">
                AI อนุมัติ เงินเข้า Wallet<br />
                ทั้งสองฝั่งให้คะแนนกัน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-2xl p-12 glow-primary">
          <h2 className="text-4xl font-bold mb-6 neon-text">
            พร้อมที่จะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-muted mb-8">
            เข้าร่วมแพลตฟอร์มที่กำลังเปลี่ยนวงการไนท์ไลฟ์ไทย
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                สมัครสมาชิกฟรี
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black text-lg px-8">
                ดูงานทั้งหมด
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 neon-text">DrinkInflu</h4>
              <p className="text-sm text-muted">
                แพลตฟอร์มตัวกลางเจ้าใหญ่<br />
                ร้านเหล้า × อินฟลูเอนเซอร์
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">สำหรับร้าน</h4>
              <ul className="text-sm text-muted space-y-2">
                <li><Link href="/post-job">โพสต์งาน</Link></li>
                <li><Link href="/pricing">แพ็กเกจ</Link></li>
                <li><Link href="/dashboard/bar">แดชบอร์ด</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">สำหรับอินฟลู</h4>
              <ul className="text-sm text-muted space-y-2">
                <li><Link href="/explore">ค้นหางาน</Link></li>
                <li><Link href="/teams">สร้างทีม</Link></li>
                <li><Link href="/dashboard/influencer">แดชบอร์ด</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">ข้อมูล</h4>
              <ul className="text-sm text-muted space-y-2">
                <li><Link href="/legal/terms">ข้อกำหนด</Link></li>
                <li><Link href="/legal/privacy">นโยบาย</Link></li>
                <li><Link href="/legal/alcohol-guidelines">แนวทางโฆษณาเหล้า</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted pt-8 border-t border-border">
            <p>© 2025 DrinkInflu. All rights reserved.</p>
            <p className="mt-2 text-xs">
              ⚠️ กรุณาดื่มอย่างมีความรับผิดชอบ | 18+ เท่านั้น
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

