import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { events, eventBookings } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        venue: {
          columns: {
            id: true,
            venueName: true,
            venueType: true,
            zone: true,
            city: true,
            address: true,
            logoUrl: true,
            images: true,
            phone: true,
            email: true,
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // เพิ่ม view count
    await db.update(events)
      .set({ 
        viewCount: (event.viewCount || 0) + 1,
      })
      .where(eq(events.id, eventId))

    // ดึงข้อมูลจำนวนคนที่จอง
    const bookingsCount = await db.query.eventBookings.findMany({
      where: eq(eventBookings.eventId, eventId),
    })

    return NextResponse.json({
      success: true,
      event: {
        ...event,
        currentBookings: bookingsCount.length,
      },
    })
  } catch (error) {
    console.error('Get event error:', error)
    return NextResponse.json(
      { error: 'Failed to get event' },
      { status: 500 }
    )
  }
}

