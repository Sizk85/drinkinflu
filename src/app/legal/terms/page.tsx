import { Navbar } from '@/components/navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">ข้อกำหนดและเงื่อนไข</h1>
        
        <div className="glass rounded-2xl p-8 space-y-6 text-muted">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. การยอมรับข้อกำหนด</h2>
            <p>
              การใช้งานแพลตฟอร์ม DrinkInflu ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมด
              หากคุณไม่เห็นด้วยกับข้อกำหนดใดๆ กรุณาหยุดใช้งานแพลตฟอร์มทันที
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. คุณสมบัติผู้ใช้งาน</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>ต้องมีอายุ 18 ปีขึ้นไป</li>
              <li>มีสิทธิ์ตามกฎหมายในการเข้าทำสัญญา</li>
              <li>ไม่ถูกระงับการใช้งานจากแพลตฟอร์ม</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. การใช้งาน</h2>
            <p>
              ผู้ใช้ต้องใช้แพลตฟอร์มด้วยความสุจริต ไม่แอบอ้าง ไม่หลอกลวง และปฏิบัติตามกฎหมาย
              ทุกฝ่ายต้องรับผิดชอบต่อเนื้อหาที่ตัวเองสร้างและโพสต์
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. การชำระเงิน</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>แพลตฟอร์มเก็บค่าคอมมิชชัน 15% จากการจ่ายเงินสด</li>
              <li>การถอนเงินมีค่าธรรมเนียม 2%</li>
              <li>เงินที่ได้รับจะถูกโอนเข้า Wallet ภายใน 24 ชั่วโมง</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. การยกเลิกและคืนเงิน</h2>
            <p>
              การยกเลิกงานต้องแจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมง มิฉะนั้นอาจมีค่าปรับตามที่กำหนด
              กรณีข้อพิพาทจะมีทีมงานเป็นคนกลางในการตัดสิน
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. ข้อจำกัดความรับผิด</h2>
            <p>
              DrinkInflu เป็นเพียงแพลตฟอร์มกลาง ไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้บริการ
              หรือข้อพิพาทระหว่างผู้ใช้
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. การแก้ไขข้อกำหนด</h2>
            <p>
              เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดได้ตลอดเวลา โดยจะแจ้งให้ทราบล่วงหน้า
            </p>
          </section>

          <div className="pt-6 border-t border-border">
            <p className="text-sm">
              อัพเดทล่าสุด: 10 ตุลาคม 2568
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

