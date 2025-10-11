'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { BANGKOK_ZONES, PHUKET_ZONES } from '@/lib/constants'

export default function SeatKeeperSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [hourlyRate, setHourlyRate] = useState(150)
  const [selectedZones, setSelectedZones] = useState<string[]>(['ทองหล่อ', 'RCA'])
  const [isActive, setIsActive] = useState(true)

  const allZones = [...BANGKOK_ZONES, ...PHUKET_ZONES]

  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      setSelectedZones(selectedZones.filter((z) => z !== zone))
    } else {
      setSelectedZones([...selectedZones, zone])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Call API to update settings
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: 'บันทึกสำเร็จ!',
        description: 'การตั้งค่าของคุณถูกอัพเดทแล้ว',
      })
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกการตั้งค่าได้',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">ตั้งค่า Seat Keeper</h1>
          <p className="text-muted">กำหนดโซนและอัตราค่าบริการของคุณ ⚙️</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Status */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">สถานะ</h2>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-5 h-5 rounded accent-primary"
              />
              <div>
                <div className="font-medium">เปิดรับงาน</div>
                <div className="text-sm text-muted">
                  เมื่อเปิด คุณจะได้รับการแจ้งเตือนงานใหม่
                </div>
              </div>
            </label>
          </div>

          {/* Hourly Rate */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">อัตราค่าบริการ</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                ค่าบริการต่อชั่วโมง
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-muted">฿</span>
                <input
                  type="number"
                  min="100"
                  max="500"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value) || 150)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-card border border-border text-white"
                />
              </div>
              <p className="text-xs text-muted mt-2">
                แนะนำ: 150-200฿/ชม. (Platform จะหัก 25% เป็นค่าธรรมเนียม)
              </p>
            </div>

            <div className="mt-4 p-4 bg-card rounded-xl">
              <div className="text-sm text-muted mb-2">ตัวอย่างการคำนวณ:</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>งาน 2 ชม. × {hourlyRate}฿:</span>
                  <span className="font-medium">{formatCurrency(hourlyRate * 2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-400">Platform Fee (25%):</span>
                  <span className="text-red-400">- {formatCurrency(hourlyRate * 2 * 0.25)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>คุณจะได้รับ:</span>
                  <span className="text-primary">{formatCurrency(hourlyRate * 2 * 0.75)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Available Zones */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">โซนที่รับงาน</h2>
            <p className="text-sm text-muted mb-4">
              เลือกโซนที่คุณสะดวกไป (เลือกได้หลายโซน)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allZones.map((zone) => (
                <button
                  key={zone}
                  type="button"
                  onClick={() => toggleZone(zone)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    selectedZones.includes(zone)
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border bg-card text-muted hover:border-primary/50'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {selectedZones.length === 0 && (
              <p className="text-sm text-yellow-500 mt-3">
                ⚠️ กรุณาเลือกอย่างน้อย 1 โซน
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || selectedZones.length === 0}
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function formatCurrency(amount: number): string {
  return `฿${amount.toLocaleString()}`
}

