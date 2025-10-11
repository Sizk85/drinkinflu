import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { seatBookings, seatKeepers, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { calculateSeatKeeperPrice, validateBookingTime } from '@/lib/seat-keeper-pricing'

/**
 * GET /api/seat-bookings - List seat bookings
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const seatKeeperId = searchParams.get('seatKeeperId')
    const status = searchParams.get('status')

    const query = db.select().from(seatBookings).$dynamic()

    const conditions = []
    if (customerId) {
      conditions.push(eq(seatBookings.customerId, customerId))
    }
    if (seatKeeperId) {
      conditions.push(eq(seatBookings.seatKeeperId, seatKeeperId))
    }
    if (status) {
      conditions.push(eq(seatBookings.status, status))
    }

    let result
    if (conditions.length > 0) {
      result = await query.where(and(...conditions)).orderBy(seatBookings.createdAt)
    } else {
      result = await query.orderBy(seatBookings.createdAt)
    }

    return NextResponse.json({
      bookings: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get seat bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/seat-bookings - Create new seat booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerId,
      venueName,
      venueZone,
      venueAddress,
      keeperStartTime,
      customerArrivalTime,
      numberOfSeats = 2,
      specialRequests,
    } = body

    // Validation
    if (!customerId || !venueName || !venueZone || !keeperStartTime || !customerArrivalTime) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    const startTime = new Date(keeperStartTime)
    const arrivalTime = new Date(customerArrivalTime)

    // Validate timing
    const validation = validateBookingTime(startTime, arrivalTime)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Calculate pricing
    const pricing = calculateSeatKeeperPrice({
      startTime,
      endTime: arrivalTime,
    })

    // Create booking (without keeper assigned yet)
    const [booking] = await db
      .insert(seatBookings)
      .values({
        customerId,
        venueName,
        venueZone,
        venueAddress,
        keeperStartTime: startTime,
        customerArrivalTime: arrivalTime,
        numberOfSeats,
        specialRequests,
        hourlyRate: pricing.keeperFee / pricing.totalHours + '',
        totalHours: pricing.totalHours + '',
        keeperFee: pricing.keeperFee + '',
        platformFee: pricing.platformFee + '',
        totalAmount: pricing.totalAmount + '',
        status: 'pending',
      })
      .returning()

    return NextResponse.json({
      success: true,
      booking,
      pricing,
      message: 'สร้างการจองสำเร็จ รอ Seat Keeper รับงาน',
    }, { status: 201 })
  } catch (error) {
    console.error('Create seat booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

