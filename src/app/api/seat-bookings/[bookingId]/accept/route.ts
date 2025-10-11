import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { seatBookings, seatKeepers } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * POST /api/seat-bookings/:bookingId/accept - Seat Keeper รับงาน
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const body = await request.json()
    const { seatKeeperId } = body

    if (!seatKeeperId) {
      return NextResponse.json(
        { error: 'seatKeeperId is required' },
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

    if (booking.status !== 'pending') {
      return NextResponse.json(
        { error: 'การจองนี้ถูกรับไปแล้ว' },
        { status: 400 }
      )
    }

    // Verify seat keeper exists
    const [keeper] = await db
      .select()
      .from(seatKeepers)
      .where(eq(seatKeepers.id, seatKeeperId))
      .limit(1)

    if (!keeper || !keeper.isActive) {
      return NextResponse.json(
        { error: 'Seat Keeper ไม่พร้อมให้บริการ' },
        { status: 400 }
      )
    }

    // Update booking
    const [updated] = await db
      .update(seatBookings)
      .set({
        seatKeeperId,
        status: 'confirmed',
        updatedAt: new Date(),
      })
      .where(eq(seatBookings.id, params.bookingId))
      .returning()

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'รับงานสำเร็จ กรุณาไปตามเวลาที่กำหนด',
    })
  } catch (error) {
    console.error('Accept booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

