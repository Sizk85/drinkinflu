import { Navbar } from '@/components/navbar'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 neon-text">นโยบายความเป็นส่วนตัว</h1>
        
        <div className="glass rounded-2xl p-8 space-y-6 text-muted">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ข้อมูลที่เก็บรวบรวม</h2>
            <p>เราเก็บข้อมูลดังต่อไปนี้:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทร)</li>
              <li>ข้อมูล Instagram (username, followers, reach)</li>
              <li>ข้อมูลการทำงาน (ประวัติงาน, รีวิว)</li>
              <li>ข้อมูลการเงิน (ธุรกรรม Wallet)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">การใช้ข้อมูล</h2>
            <p>ข้อมูลของคุณจะถูกใช้เพื่อ:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>จัดการบัญชีและการทำงานของแพลตฟอร์ม</li>
              <li>ตรวจสอบตัวตนและป้องกันการฉ้อโกง</li>
              <li>ปรับปรุงบริการและประสบการณ์การใช้งาน</li>
              <li>ส่งข้อมูลที่เกี่ยวข้องกับงานและการชำระเงิน</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">การแบ่งปันข้อมูล</h2>
            <p>
              เราจะไม่ขายหรือแบ่งปันข้อมูลของคุณกับบุคคลที่สาม ยกเว้นกรณีที่จำเป็นตามกฎหมาย
              หรือเพื่อให้บริการแพลตฟอร์มทำงานได้
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ความปลอดภัย</h2>
            <p>
              เราใช้มาตรการรักษาความปลอดภัยมาตรฐานอุตสาหกรรม เช่น การเข้ารหัสข้อมูล (SSL/TLS)
              และระบบยืนยันตัวตนหลายขั้นตอน
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">สิทธิ์ของคุณ</h2>
            <p>คุณมีสิทธิ์ในการ:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>เข้าถึงและแก้ไขข้อมูลของคุณ</li>
              <li>ลบบัญชีและข้อมูลของคุณ</li>
              <li>ขอรับสำเนาข้อมูลของคุณ</li>
              <li>คัดค้านการใช้ข้อมูลบางประเภท</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">ติดต่อเรา</h2>
            <p>
              หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว กรุณาติดต่อ:<br />
              Email: privacy@drinkinflu.com
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

