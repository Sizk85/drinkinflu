import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { BAR_PLANS, INFLUENCER_PLANS } from '@/lib/constants'

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            แพ็กเกจที่เหมาะกับคุณ
          </h1>
          <p className="text-xl text-muted">
            เลือกแพ็กเกจที่ตอบโจทย์การใช้งานของคุณ
          </p>
        </div>

        {/* Bar Plans */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">สำหรับร้านเหล้า/บาร์</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {BAR_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass rounded-2xl p-8 relative ${
                  'popular' in plan && plan.popular ? 'ring-2 ring-primary glow-primary' : ''
                }`}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-sm font-bold">
                    แนะนำ
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary mb-1">
                    ฿{plan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted">/เดือน</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={'popular' in plan && plan.popular ? 'default' : 'outline'}
                >
                  เลือกแพ็กเกจนี้
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Influencer Plans */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">สำหรับอินฟลูเอนเซอร์</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {INFLUENCER_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass rounded-2xl p-8 relative ${
                  'popular' in plan && plan.popular ? 'ring-2 ring-accent glow-accent' : ''
                }`}
              >
                {'popular' in plan && plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-black rounded-full text-sm font-bold">
                    คุ้มที่สุด
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-accent mb-1">
                    {plan.price === 0 ? 'ฟรี' : `฿${plan.price.toLocaleString()}`}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-sm text-muted">/เดือน</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="text-accent flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    'popular' in plan && plan.popular
                      ? 'bg-accent text-black hover:bg-accent/90'
                      : ''
                  }`}
                  variant={'popular' in plan && plan.popular ? 'default' : 'outline'}
                >
                  {plan.price === 0 ? 'เริ่มใช้งานฟรี' : 'อัพเกรดตอนนี้'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">คำถามที่พบบ่อย</h2>
          
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-2">ยกเลิกได้ไหม?</h3>
              <p className="text-muted text-sm">
                ยกเลิกได้ทุกเวลา ไม่มีข้อผูกมัด แพ็กเกจจะหมดอายุเมื่อสิ้นรอบบิล
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-2">จ่ายอย่างไร?</h3>
              <p className="text-muted text-sm">
                รับชำระผ่านบัตรเครดิต/เดบิต, โอนเงิน หรือ QR Code
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="font-bold mb-2">มีค่าซ่อนอื่นๆ ไหม?</h3>
              <p className="text-muted text-sm">
                ไม่มี! ราคาที่แสดงคือราคาจริง มีเพียงค่าคอมมิชชัน 15% จากงานที่สำเร็จ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

