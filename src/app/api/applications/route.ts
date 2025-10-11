import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { applications } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/applications - List applications
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')
    const influencerId = searchParams.get('influencerId')

    const query = db.select().from(applications).$dynamic()

    // Apply filters
    if (jobId) {
      const result = await query.where(eq(applications.jobId, jobId)).orderBy(applications.createdAt)
      return NextResponse.json({ applications: result, count: result.length })
    } else if (influencerId) {
      const result = await query.where(eq(applications.influencerId, influencerId)).orderBy(applications.createdAt)
      return NextResponse.json({ applications: result, count: result.length })
    }

    const result = await query.orderBy(applications.createdAt)

    return NextResponse.json({
      applications: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/applications - Create new application (apply to job)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, influencerId, teamId } = body

    // Validation
    if (!jobId || !influencerId) {
      return NextResponse.json(
        { error: 'jobId and influencerId are required' },
        { status: 400 }
      )
    }

    // Check if already applied
    const existing = await db
      .select()
      .from(applications)
      .where(
        eq(applications.jobId, jobId) &&
        eq(applications.influencerId, influencerId)
      )
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Already applied to this job' },
        { status: 400 }
      )
    }

    // Create application
    const [application] = await db
      .insert(applications)
      .values({
        jobId,
        influencerId,
        teamId: teamId || null,
        status: 'pending',
        verificationStatus: 'pending_proof',
      })
      .returning()

    return NextResponse.json({
      success: true,
      application,
      message: 'สมัครงานสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

