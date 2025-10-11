import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { teamMembers } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/teams/:teamId/members - List team members
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.teamId, params.teamId))

    return NextResponse.json({
      members,
      count: members.length,
    })
  } catch (error) {
    console.error('Get team members error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/teams/:teamId/members - Add team member
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const body = await request.json()
    const { influencerId, sharePercentage } = body

    // Validation
    if (!influencerId) {
      return NextResponse.json(
        { error: 'influencerId is required' },
        { status: 400 }
      )
    }

    // Add member
    const [member] = await db
      .insert(teamMembers)
      .values({
        teamId: params.teamId,
        influencerId,
        sharePercentage: sharePercentage || '0.85',
        status: 'active',
      })
      .returning()

    return NextResponse.json({
      success: true,
      member,
      message: 'เพิ่มสมาชิกสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Add team member error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

