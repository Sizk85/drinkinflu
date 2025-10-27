import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { partnerVenues, users } from '@/db/schema'
import { eq, and, or, ilike } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/venues - ดูรายการร้านพาร์ทเนอร์
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const zone = searchParams.get('zone')
    const city = searchParams.get('city')
    const venueType = searchParams.get('type')
    const isActive = searchParams.get('active') !== 'false'
    const search = searchParams.get('search')

    let query: any = db.query.partnerVenues

    // สร้าง conditions
    const conditions = []
    if (zone) conditions.push(eq(partnerVenues.zone, zone))
    if (city) conditions.push(eq(partnerVenues.city, city))
    if (venueType) conditions.push(eq(partnerVenues.venueType, venueType))
    if (isActive) conditions.push(eq(partnerVenues.isActive, true))
    if (search) conditions.push(ilike(partnerVenues.venueName, `%${search}%`))

    const venues = await db.query.partnerVenues.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (partnerVenues, { desc }) => [desc(partnerVenues.rating)],
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      venues,
      total: venues.length,
    })
  } catch (error) {
    console.error('Get venues error:', error)
    return NextResponse.json(
      { error: 'Failed to get venues' },
      { status: 500 }
    )
  }
}

// POST /api/venues - ลงทะเบียนร้านใหม่
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
      venueName,
      venueType,
      description,
      zone,
      city,
      address,
      latitude,
      longitude,
      phone,
      email,
      website,
      logoUrl,
      images,
      musicStyle,
      capacity,
      openingHours,
      amenities,
    } = body

    if (!venueName || !venueType || !zone || !city) {
      return NextResponse.json(
        { error: 'Venue name, type, zone, and city are required' },
        { status: 400 }
      )
    }

    // สร้างร้านใหม่
    const [venue] = await db.insert(partnerVenues).values({
      ownerId: currentUser.id,
      venueName,
      venueType,
      description: description || null,
      zone,
      city,
      address: address || null,
      latitude: latitude || null,
      longitude: longitude || null,
      phone: phone || null,
      email: email || null,
      website: website || null,
      logoUrl: logoUrl || null,
      images: images || [],
      musicStyle: musicStyle || null,
      capacity: capacity || null,
      openingHours: openingHours || [],
      amenities: amenities || [],
      isVerified: false,
      isActive: true,
    }).returning()

    return NextResponse.json({
      success: true,
      venue,
      message: 'Venue registered successfully. Awaiting verification.',
    })
  } catch (error) {
    console.error('Create venue error:', error)
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    )
  }
}

// PATCH /api/venues/:id - อัพเดทข้อมูลร้าน
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
    const { venueId, ...updates } = body

    if (!venueId) {
      return NextResponse.json({ error: 'Venue ID required' }, { status: 400 })
    }

    // ตรวจสอบว่าเป็นเจ้าของร้านหรือ admin
    const venue = await db.query.partnerVenues.findFirst({
      where: eq(partnerVenues.id, venueId),
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    if (venue.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized to update this venue' },
        { status: 403 }
      )
    }

    // อัพเดทข้อมูล
    const [updated] = await db.update(partnerVenues)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(partnerVenues.id, venueId))
      .returning()

    return NextResponse.json({
      success: true,
      venue: updated,
    })
  } catch (error) {
    console.error('Update venue error:', error)
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    )
  }
}

