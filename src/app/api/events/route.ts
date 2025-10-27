import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { events, partnerVenues, users } from '@/db/schema'
import { eq, and, gte, lte } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/events - ดูรายการอีเวนท์
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const venueId = searchParams.get('venueId')
    const status = searchParams.get('status') || 'upcoming'
    const isFeatured = searchParams.get('featured') === 'true'

    const conditions = []
    if (venueId) conditions.push(eq(events.venueId, venueId))
    if (status) conditions.push(eq(events.status, status))
    if (isFeatured) conditions.push(eq(events.isFeatured, true))
    conditions.push(eq(events.isPublished, true))

    const eventsList = await db.query.events.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (events, { asc }) => [asc(events.startTime)],
      with: {
        venue: {
          columns: {
            id: true,
            venueName: true,
            zone: true,
            city: true,
            logoUrl: true,
          }
        },
        createdByUser: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      events: eventsList,
      total: eventsList.length,
    })
  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { error: 'Failed to get events' },
      { status: 500 }
    )
  }
}

// POST /api/events - สร้างอีเวนท์ใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      venueId,
      title,
      description,
      eventType,
      startTime,
      endTime,
      posterUrl,
      images,
      hasPromotion,
      promotionDetails,
      discountPercentage,
      requiresBooking,
      maxCapacity,
      bookingFee,
    } = body

    if (!venueId || !title || !eventType || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Venue ID, title, event type, start time, and end time are required' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่ามีสิทธิ์สร้างอีเวนท์ให้ venue นี้
    const venue = await db.query.partnerVenues.findFirst({
      where: eq(partnerVenues.id, venueId),
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    if (venue.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to create event for this venue' },
        { status: 403 }
      )
    }

    // สร้างอีเวนท์ใหม่
    const [event] = await db.insert(events).values({
      venueId,
      createdBy: currentUser.id,
      title,
      description: description || null,
      eventType,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      posterUrl: posterUrl || null,
      images: images || [],
      hasPromotion: hasPromotion || false,
      promotionDetails: promotionDetails || null,
      discountPercentage: discountPercentage || null,
      requiresBooking: requiresBooking || false,
      maxCapacity: maxCapacity || null,
      bookingFee: bookingFee || null,
      status: 'upcoming',
      isPublished: true,
      isFeatured: false,
    }).returning()

    return NextResponse.json({
      success: true,
      event,
      message: 'Event created successfully',
    })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// PATCH /api/events - อัพเดทอีเวนท์
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { eventId, ...updates } = body

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    // ตรวจสอบสิทธิ์
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        venue: true
      }
    }) as any

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    if (event.venue.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this event' },
        { status: 403 }
      )
    }

    // อัพเดท
    const [updated] = await db.update(events)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning()

    return NextResponse.json({
      success: true,
      event: updated,
    })
  } catch (error) {
    console.error('Update event error:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

