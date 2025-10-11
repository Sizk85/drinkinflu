import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { seatKeepers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/seat-keepers - List seat keepers
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zone = searchParams.get('zone')
    const isActive = searchParams.get('isActive')

    let query = db
      .select({
        keeper: seatKeepers,
        user: users,
      })
      .from(seatKeepers)
      .leftJoin(users, eq(seatKeepers.userId, users.id))

    // Apply filters (simplified - in production use proper filtering)
    const result = await query

    return NextResponse.json({
      keepers: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get seat keepers error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/seat-keepers - Register as seat keeper
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, availableZones, hourlyRate } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Check if already registered
    const existing = await db
      .select()
      .from(seatKeepers)
      .where(eq(seatKeepers.userId, userId))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'คุณเป็น Seat Keeper อยู่แล้ว' },
        { status: 400 }
      )
    }

    // Create seat keeper profile
    const [keeper] = await db
      .insert(seatKeepers)
      .values({
        userId,
        availableZones: availableZones || [],
        hourlyRate: hourlyRate || '150',
        isActive: true,
      })
      .returning()

    return NextResponse.json({
      success: true,
      keeper,
      message: 'สมัครเป็น Seat Keeper สำเร็จ!',
    }, { status: 201 })
  } catch (error) {
    console.error('Create seat keeper error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

