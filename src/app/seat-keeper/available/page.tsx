'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { formatCurrency } from '@/lib/pricing'
import { formatDateTime } from '@/lib/date-utils'
import { MapPin, Clock, Users } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AvailableJobsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Mock available bookings
  const availableBookings = [
    {
      id: '1',
      venueName: 'Route 66 Club',
      venueZone: 'RCA',
      venueAddress: 'RCA Plaza, กรุงเทพฯ',
      keeperStartTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      customerArrivalTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
      numberOfSeats: 4,
      keeperFee: 300,
      totalHours: 2,
    },
    {
      id: '2',
      venueName: 'Illuzion Phuket',
      venueZone: 'ภูเก็ต',
      venueAddress: 'Bangla Road, Patong',
      keeperStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      customerArrivalTime: new Date(Date.now() + 27 * 60 * 60 * 1000),
      numberOfSeats: 6,
      keeperFee: 600,
      totalHours: 3,
    },
  ]

  const handleAccept = async (bookingId: string) => {
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

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">งาน Seat Keeper ว่าง</h1>
          <p className="text-muted">เลือกงานที่เหมาะกับคุณ</p>
        </div>

        {availableBookings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <h3 className="text-2xl font-bold mb-2">ไม่มีงานว่างในขณะนี้</h3>
            <p className="text-muted">กลับมาดูใหม่ภายหลัง</p>
          </div>
        ) : (
          <div className="space-y-6">
            {availableBookings.map((booking) => (
              <div key={booking.id} className="glass rounded-2xl p-6 hover:glow-primary transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{booking.venueName}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1.5 text-muted">
                        <MapPin size={16} className="text-primary" />
                        <span>{booking.venueZone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted">
                        <Users size={16} className="text-accent" />
                        <span>{booking.numberOfSeats} ที่นั่ง</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted">
                        <Clock size={16} className="text-green-500" />
                        <span>{booking.totalHours} ชม.</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-card rounded-xl mb-4">
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

                    {booking.venueAddress && (
                      <p className="text-sm text-muted">📍 {booking.venueAddress}</p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right mb-4">
                      <div className="text-sm text-muted mb-1">คุณจะได้รับ</div>
                      <div className="text-4xl font-bold text-primary">
                        {formatCurrency(booking.keeperFee)}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        ({formatCurrency(booking.keeperFee / booking.totalHours)}/ชม.)
                      </div>
                    </div>

                    <Button 
                      className="w-full md:w-auto px-8"
                      onClick={() => handleAccept(booking.id)}
                      disabled={isLoading}
                    >
                      รับงาน
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

