import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { seatBookings } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * POST /api/seat-bookings/:bookingId/checkin - Seat Keeper เช็คอิน
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const body = await request.json()
    const { proofImageUrl } = body

    if (!proofImageUrl) {
      return NextResponse.json(
        { error: 'กรุณาอัปโหลดรูปภาพเป็นหลักฐาน' },
        { status: 400 }
      )
    }

    // Get booking
    const [booking] = await db
      .select()
      .from(seatBookings)
      .where(eq(seatBookings.id, params.bookingId))
      .limit(1)

    if (!booking) {
      return NextResponse.json(
        { error: 'ไม่พบการจองนี้' },
        { status: 404 }
      )
    }

    if (booking.status !== 'confirmed') {
      return NextResponse.json(
        { error: 'สถานะการจองไม่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Update booking with check-in
    const [updated] = await db
      .update(seatBookings)
      .set({
        keeperCheckInTime: new Date(),
        keeperCheckInProof: proofImageUrl,
        status: 'keeper_arrived',
        updatedAt: new Date(),
      })
      .where(eq(seatBookings.id, params.bookingId))
      .returning()

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'เช็คอินสำเร็จ! รอลูกค้ามาถึง',
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

