import { Navbar } from '@/components/navbar'

export default function AlcoholGuidelinesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">แนวทางการโฆษณาเครื่องดื่มแอลกอฮอล์</h1>
        
        <div className="glass rounded-2xl p-8 space-y-6 text-muted">
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-4 text-yellow-200">
            <p className="font-bold mb-2">⚠️ คำเตือนสำคัญ</p>
            <p>
              การโฆษณาเครื่องดื่มแอลกอฮอล์ต้องปฏิบัติตามกฎหมายไทย และแนวทางของแพลตฟอร์ม Social Media
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">กฎหมายที่เกี่ยวข้อง</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>พ.ร.บ. ควบคุมเครื่องดื่มแอลกอฮอล์ พ.ศ. 2551</li>
              <li>ห้ามโฆษณาเครื่องดื่มแอลกอฮอล์โดยตรง</li>
              <li>ห้ามแสดงภาพขวดเครื่องดื่มชัดเจน</li>
              <li>ห้ามชี้ชวนให้ดื่ม</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">แนวทางที่แนะนำ</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>✅ โฟกัสที่บรรยากาศร้าน ดนตรี แสงสี</li>
              <li>✅ แสดงภาพกลุ่มเพื่อนสนุกสนาน</li>
              <li>✅ เน้นประสบการณ์และความบันเทิง</li>
              <li>✅ ใช้ hashtag ที่เกี่ยวกับร้าน ไม่ใช่เครื่องดื่ม</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">สิ่งที่ห้ามทำ</h2>
            <ul className="space-y-2">
              <li>❌ แสดงภาพขวด/แก้วเครื่องดื่มแบบ close-up</li>
              <li>❌ ใช้คำว่า &ldquo;เหล้า&rdquo; &ldquo;เบียร์&rdquo; &ldquo;ดื่ม&rdquo; โดยตรง</li>
              <li>❌ ชี้ชวนให้ดื่ม หรือระบุราคาเครื่องดื่ม</li>
              <li>❌ โฆษณาในช่วงเวลาที่ห้าม (17:00-22:00)</li>
              <li>❌ ใช้คนดังหรือดาราในการโฆษณา</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ตัวอย่างเนื้อหาที่เหมาะสม</h2>
            <div className="bg-card rounded-xl p-4 space-y-2">
              <p>✅ &ldquo;บรรยากาศสุดมันส์ที่ Route 66 คืนนี้! 🎉&rdquo;</p>
              <p>✅ &ldquo;พาเพื่อนมาสังสรรค์ที่ร้านโปรด 🌃&rdquo;</p>
              <p>✅ &ldquo;DJ เทพๆ แสงสีสวยงาม ประสบการณ์ที่ลืมไม่ลง&rdquo;</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">มาตรการของแพลตฟอร์ม</h2>
            <p>
              DrinkInflu มีระบบตรวจสอบเนื้อหาด้วย AI และทีมงาน หากพบการละเมิด:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>ครั้งแรก: เตือน และขอแก้ไข</li>
              <li>ซ้ำซ้อน: ระงับบัญชีชั่วคราว</li>
              <li>ร้ายแรง: ระงับบัญชีถาวร</li>
            </ul>
          </section>

          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
            <p className="font-bold mb-2">🔞 อายุ 18+</p>
            <p>
              แพลตฟอร์มนี้สำหรับผู้ที่มีอายุ 18 ปีขึ้นไปเท่านั้น<br />
              กรุณาดื่มอย่างมีความรับผิดชอบ
            </p>
          </div>

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

