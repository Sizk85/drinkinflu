import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { teams, teamMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/teams - List teams
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const ownerId = searchParams.get('ownerId')

    const query = db.select().from(teams).$dynamic()

    let result
    if (ownerId) {
      result = await query.where(eq(teams.ownerId, ownerId))
    } else {
      result = await query
    }

    return NextResponse.json({
      teams: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get teams error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/teams - Create new team
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ownerId, name, description, commissionRate } = body

    // Validation
    if (!ownerId || !name) {
      return NextResponse.json(
        { error: 'ownerId and name are required' },
        { status: 400 }
      )
    }

    // Create team
    const [team] = await db
      .insert(teams)
      .values({
        ownerId,
        name,
        description,
        commissionRate: commissionRate || '0.15',
      })
      .returning()

    return NextResponse.json({
      success: true,
      team,
      message: 'สร้างทีมสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Create team error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

