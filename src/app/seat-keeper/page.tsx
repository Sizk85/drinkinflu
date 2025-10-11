'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/pricing'
import { formatDateTime } from '@/lib/date-utils'
import { Clock, MapPin, CheckCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function SeatKeeperPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    rating: 0,
    activeBookings: 0,
  })

  // Mock data - ในการใช้งานจริงจะดึงจาก API
  useEffect(() => {
    setStats({
      totalEarnings: 4500,
      totalBookings: 12,
      rating: 4.8,
      activeBookings: 2,
    })
    
    setBookings([
      {
        id: '1',
        venueName: 'Demon Bar',
        venueZone: 'ทองหล่อ',
        keeperStartTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        customerArrivalTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        keeperFee: 300,
        status: 'confirmed',
      },
    ] as any)
  }, [])

  const handleAcceptBooking = async (bookingId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/seat-bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatKeeperId: 'temp-keeper-id' }),
      })

      if (!response.ok) throw new Error('ไม่สามารถรับงานได้')

      toast({
        title: 'รับงานสำเร็จ!',
        description: 'กรุณาไปตามเวลาที่กำหนด',
      })
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

  const handleCheckIn = async (bookingId: string) => {
    // TODO: Upload photo first
    const proofImageUrl = 'https://example.com/proof.jpg'

    setIsLoading(true)
    try {
      const response = await fetch(`/api/seat-bookings/${bookingId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proofImageUrl }),
      })

      if (!response.ok) throw new Error('ไม่สามารถเช็คอินได้')

      toast({
        title: 'เช็คอินสำเร็จ!',
        description: 'รอลูกค้ามาถึง',
      })
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
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">Seat Keeper Dashboard</h1>
          <p className="text-muted">รับงาน นั่งโต๊ะ รับเงิน 💰</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="text-primary" size={20} />
              <span className="text-sm text-muted">รายได้ทั้งหมด</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(stats.totalEarnings)}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-accent" size={20} />
              <span className="text-sm text-muted">งานที่ทำ</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalBookings}</div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm text-muted">เรตติ้ง</span>
            </div>
            <div className="text-3xl font-bold text-yellow-500">{stats.rating}</div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-green-500" size={20} />
              <span className="text-sm text-muted">งานที่กำลังทำ</span>
            </div>
            <div className="text-3xl font-bold text-green-500">{stats.activeBookings}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/seat-keeper/available">
            <Button className="w-full h-16 text-lg">
              🔍 หางานใหม่
            </Button>
          </Link>
          <Link href="/seat-keeper/settings">
            <Button variant="outline" className="w-full h-16 text-lg">
              ⚙️ ตั้งค่าโซนและเวลา
            </Button>
          </Link>
          <Link href="/wallet">
            <Button variant="outline" className="w-full h-16 text-lg">
              💰 ถอนเงิน
            </Button>
          </Link>
        </div>

        {/* Active Bookings */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">งานที่กำลังดำเนินการ</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีงาน</p>
              <Link href="/seat-keeper/available">
                <Button className="mt-4">หางานใหม่</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="p-6 bg-card rounded-xl border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{booking.venueName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {booking.venueZone}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-500 text-sm">
                      {booking.status === 'confirmed' ? 'รับงานแล้ว' : booking.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-background/50 rounded-xl">
                    <div>
                      <div className="text-xs text-muted mb-1">คุณต้องไปถึง</div>
                      <div className="font-bold text-primary">
                        {formatDateTime(booking.keeperStartTime)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">ลูกค้ามาถึง</div>
                      <div className="font-bold">
                        {formatDateTime(booking.customerArrivalTime)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(booking.keeperFee)}
                    </div>
                    {booking.status === 'confirmed' && (
                      <Button onClick={() => handleCheckIn(booking.id)}>
                        📸 เช็คอิน
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

