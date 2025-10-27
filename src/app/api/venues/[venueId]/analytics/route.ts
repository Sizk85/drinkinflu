import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { partnerVenues, venueAnalytics, seatBookings, events, users } from '@/db/schema'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { venueId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { venueId } = params
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // ตรวจสอบว่ามีสิทธิ์ดู analytics
    const venue = await db.query.partnerVenues.findFirst({
      where: eq(partnerVenues.id, venueId),
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // ต้องเป็นเจ้าของร้านหรือ admin
    if (venue.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to view analytics' },
        { status: 403 }
      )
    }

    // สร้าง date range
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    // ดึงข้อมูล analytics
    const conditions = [
      eq(venueAnalytics.venueId, venueId),
      gte(venueAnalytics.date, start),
      lte(venueAnalytics.date, end),
    ]

    const analyticsData = await db.query.venueAnalytics.findMany({
      where: and(...conditions),
      orderBy: (venueAnalytics, { asc }) => [asc(venueAnalytics.date)]
    })

    // คำนวณสรุป
    const summary = {
      totalBookings: analyticsData.reduce((sum, d) => sum + (d.totalBookings || 0), 0),
      totalRevenue: analyticsData.reduce((sum, d) => sum + parseFloat(d.totalRevenue || '0'), 0),
      totalViews: analyticsData.reduce((sum, d) => sum + (d.totalViews || 0), 0),
      uniqueVisitors: analyticsData.reduce((sum, d) => sum + (d.uniqueVisitors || 0), 0),
      seatKeeperBookings: analyticsData.reduce((sum, d) => sum + (d.seatKeeperBookings || 0), 0),
      eventAttendance: analyticsData.reduce((sum, d) => sum + (d.eventAttendance || 0), 0),
    }

    // ข้อมูลการจอง Seat Keeper ของร้านนี้
    const bookings = await db.query.seatBookings.findMany({
      where: and(
        eq(seatBookings.venueName, venue.venueName),
        gte(seatBookings.createdAt, start),
        lte(seatBookings.createdAt, end)
      ),
      orderBy: (seatBookings, { desc }) => [desc(seatBookings.createdAt)]
    })

    // อีเวนท์ของร้าน
    const venueEvents = await db.query.events.findMany({
      where: and(
        eq(events.venueId, venueId),
        gte(events.startTime, start),
        lte(events.endTime, end)
      ),
    })

    return NextResponse.json({
      success: true,
      analytics: analyticsData,
      summary,
      recentBookings: bookings.slice(0, 10),
      upcomingEvents: venueEvents.filter(e => e.status === 'upcoming'),
      venue,
    })
  } catch (error) {
    console.error('Get venue analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    )
  }
}

// POST - บันทึก analytics (Internal use / Worker)
export async function POST(
  request: NextRequest,
  { params }: { params: { venueId: string } }
) {
  try {
    const { venueId } = params
    const body = await request.json()

    const {
      date,
      totalBookings,
      totalRevenue,
      totalViews,
      uniqueVisitors,
      seatKeeperBookings,
      averageWaitTime,
      eventAttendance,
    } = body

    // ตรวจสอบว่ามีข้อมูลวันนี้แล้วหรือยัง
    const existingRecord = await db.query.venueAnalytics.findFirst({
      where: and(
        eq(venueAnalytics.venueId, venueId),
        eq(venueAnalytics.date, new Date(date))
      ),
    })

    if (existingRecord) {
      // อัพเดท
      const [updated] = await db.update(venueAnalytics)
        .set({
          totalBookings,
          totalRevenue,
          totalViews,
          uniqueVisitors,
          seatKeeperBookings,
          averageWaitTime,
          eventAttendance,
        })
        .where(eq(venueAnalytics.id, existingRecord.id))
        .returning()

      return NextResponse.json({
        success: true,
        analytics: updated,
      })
    } else {
      // สร้างใหม่
      const [created] = await db.insert(venueAnalytics).values({
        venueId,
        date: new Date(date),
        totalBookings,
        totalRevenue,
        totalViews,
        uniqueVisitors,
        seatKeeperBookings,
        averageWaitTime,
        eventAttendance,
      }).returning()

      return NextResponse.json({
        success: true,
        analytics: created,
      })
    }
  } catch (error) {
    console.error('Save venue analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to save analytics' },
      { status: 500 }
    )
  }
}

