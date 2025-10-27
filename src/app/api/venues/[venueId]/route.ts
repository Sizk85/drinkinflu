import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { partnerVenues } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { venueId: string } }
) {
  try {
    const { venueId } = params

    const venue = await db.query.partnerVenues.findFirst({
      where: eq(partnerVenues.id, venueId),
      with: {
        owner: {
          columns: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        }
      }
    })

    if (!venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 })
    }

    // เพิ่ม view count
    await db.update(partnerVenues)
      .set({ 
        // viewCount จะถูกอัพเดทใน analytics แยก
      })
      .where(eq(partnerVenues.id, venueId))

    return NextResponse.json({
      success: true,
      venue,
    })
  } catch (error) {
    console.error('Get venue error:', error)
    return NextResponse.json(
      { error: 'Failed to get venue' },
      { status: 500 }
    )
  }
}

