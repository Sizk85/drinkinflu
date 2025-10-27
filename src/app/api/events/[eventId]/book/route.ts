import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { events, eventBookings, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { eventId } = params
    const body = await request.json()
    const { numberOfPeople } = body

    if (!numberOfPeople || numberOfPeople < 1) {
      return NextResponse.json(
        { error: 'Number of people is required and must be at least 1' },
        { status: 400 }
      )
    }

    // ดึงข้อมูล event
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (!event.requiresBooking) {
      return NextResponse.json(
        { error: 'This event does not require booking' },
        { status: 400 }
      )
    }

    // ตรวจสอบจำนวนที่นั่ง
    if (event.maxCapacity) {
      const currentBookings = await db.query.eventBookings.findMany({
        where: eq(eventBookings.eventId, eventId),
      })

      const totalBooked = currentBookings.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0)

      if (totalBooked + numberOfPeople > event.maxCapacity) {
        return NextResponse.json(
          { error: 'Not enough capacity available' },
          { status: 400 }
        )
      }
    }

    // หาผู้ใช้ปัจจุบัน
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // คำนวณราคา
    const bookingFee = parseFloat(event.bookingFee || '0')
    const totalAmount = bookingFee * numberOfPeople

    // ตรวจสอบ wallet balance
    const userBalance = parseFloat(currentUser.walletBalance || '0')
    if (totalAmount > 0 && userBalance < totalAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      )
    }

    // หักเงินจาก wallet ถ้ามีค่าจอง
    if (totalAmount > 0) {
      await db.update(users)
        .set({ walletBalance: (userBalance - totalAmount).toFixed(2) })
        .where(eq(users.id, currentUser.id))
    }

    // สร้างการจอง
    const [booking] = await db.insert(eventBookings).values({
      eventId,
      userId: currentUser.id,
      numberOfPeople,
      totalAmount: totalAmount.toFixed(2),
      status: 'confirmed',
    }).returning()

    // อัพเดท currentBookings ของ event
    await db.update(events)
      .set({
        currentBookings: (event.currentBookings || 0) + 1,
      })
      .where(eq(events.id, eventId))

    return NextResponse.json({
      success: true,
      booking,
      message: 'Event booked successfully',
    })
  } catch (error) {
    console.error('Book event error:', error)
    return NextResponse.json(
      { error: 'Failed to book event' },
      { status: 500 }
    )
  }
}

