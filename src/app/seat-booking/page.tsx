'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { BANGKOK_ZONES } from '@/lib/constants'
import { calculateSeatKeeperPrice, suggestKeeperStartTime } from '@/lib/seat-keeper-pricing'
import { formatCurrency } from '@/lib/pricing'
import { Clock, MapPin, Users, Shield } from 'lucide-react'

export default function SeatBookingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [venueName, setVenueName] = useState('')
  const [venueZone, setVenueZone] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [numberOfSeats, setNumberOfSeats] = useState(2)
  const [specialRequests, setSpecialRequests] = useState('')
  const [keeperStartTime, setKeeperStartTime] = useState('')

  // Auto-calculate keeper start time
  const handleArrivalTimeChange = (time: string) => {
    setArrivalTime(time)
    if (arrivalDate && time) {
      const customerArrival = new Date(`${arrivalDate}T${time}`)
      const suggested = suggestKeeperStartTime(customerArrival, 1.5)
      const hours = suggested.getHours().toString().padStart(2, '0')
      const mins = suggested.getMinutes().toString().padStart(2, '0')
      setKeeperStartTime(`${hours}:${mins}`)
    }
  }

  // Calculate pricing
  const pricing = arrivalDate && arrivalTime && keeperStartTime ? calculateSeatKeeperPrice({
    startTime: new Date(`${arrivalDate}T${keeperStartTime}`),
    endTime: new Date(`${arrivalDate}T${arrivalTime}`),
  }) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/seat-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'temp-user-id', // TODO: Get from session
          venueName,
          venueZone,
          venueAddress,
          keeperStartTime: new Date(`${arrivalDate}T${keeperStartTime}`).toISOString(),
          customerArrivalTime: new Date(`${arrivalDate}T${arrivalTime}`).toISOString(),
          numberOfSeats,
          specialRequests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาด')
      }

      toast({
        title: 'จองสำเร็จ!',
        description: 'รอ Seat Keeper รับงาน เราจะแจ้งเตือนเมื่อมีคนรับงาน',
      })

      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
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
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 neon-text">
            จอง Seat Keeper
          </h1>
          <p className="text-xl text-muted">
            มีคนนั่งโต๊ะรอคุณอยู่แล้ว ไม่ต้องกลัวไม่มีที่นั่ง! 🪑✨
          </p>
        </div>

        {/* How it works */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">ระบบทำงานอย่างไร?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <div>
                <div className="font-medium mb-1">คุณจอง</div>
                <div className="text-sm text-muted">เลือกร้านและเวลาที่ต้องการไป</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-accent">2</span>
              </div>
              <div>
                <div className="font-medium mb-1">Keeper ไปนั่งแทน</div>
                <div className="text-sm text-muted">มีคนไปนั่งโต๊ะรอคุณก่อน 1-2 ชม.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">3</span>
              </div>
              <div>
                <div className="font-medium mb-1">คุณมาถึง</div>
                <div className="text-sm text-muted">มีโต๊ะรออยู่แล้ว!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Venue Info */}
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="text-primary" />
              ข้อมูลร้าน
            </h2>

            <div>
              <label className="block text-sm font-medium mb-2">ชื่อร้าน *</label>
              <input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="เช่น: Demon Bar, Route 66"
                required
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">โซน *</label>
                <select
                  value={venueZone}
                  onChange={(e) => setVenueZone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
                >
                  <option value="">เลือกโซน</option>
                  {BANGKOK_ZONES.map((zone) => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">จำนวนที่นั่ง *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfSeats}
                  onChange={(e) => setNumberOfSeats(parseInt(e.target.value) || 1)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">ที่อยู่ร้าน</label>
              <textarea
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="ที่อยู่เพิ่มเติม (ถ้ามี)"
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>
          </div>

          {/* Timing */}
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="text-accent" />
              เวลา
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">วันที่ *</label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">เวลาที่คุณจะไปถึง *</label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => handleArrivalTimeChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
                />
              </div>
            </div>

            {keeperStartTime && (
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
                <div className="text-sm text-muted mb-1">🕐 Seat Keeper จะไปถึงเวลา:</div>
                <div className="text-2xl font-bold text-primary">{keeperStartTime}</div>
                <div className="text-xs text-muted mt-1">
                  (ก่อนคุณไปถึง {pricing?.totalHours} ชม.)
                </div>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div className="glass rounded-2xl p-6 space-y-6">
            <h2 className="text-2xl font-bold">คำขอพิเศษ (ถ้ามี)</h2>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="เช่น: ต้องการโต๊ะใกล้ DJ Booth, ต้องการมุมสงบ"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
            />
          </div>

          {/* Pricing Summary */}
          {pricing && (
            <div className="glass rounded-2xl p-6 space-y-4">
              <h2 className="text-2xl font-bold">สรุปค่าใช้จ่าย</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">ค่า Seat Keeper ({pricing.totalHours} ชม.):</span>
                  <span className="font-medium">{formatCurrency(pricing.keeperFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">ค่าบริการ Platform (25%):</span>
                  <span className="font-medium text-accent">{formatCurrency(pricing.platformFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>รวมทั้งหมด:</span>
                  <span className="text-primary">{formatCurrency(pricing.totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/30 text-sm">
                <Shield className="text-green-500" size={20} />
                <span>มีการันตีว่ามีโต๊ะรออยู่แน่นอน!</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !pricing}
            >
              {isLoading ? 'กำลังจอง...' : `ชำระ ${pricing ? formatCurrency(pricing.totalAmount) : '฿0'}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

