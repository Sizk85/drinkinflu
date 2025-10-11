import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { jobs } from '@/db/schema'
import { eq, and, gte } from 'drizzle-orm'

/**
 * GET /api/jobs - List jobs with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const barId = searchParams.get('barId')

    const query = db.select().from(jobs).$dynamic()

    // Apply filters
    const conditions = []
    if (status) {
      conditions.push(eq(jobs.status, status))
    }
    if (barId) {
      conditions.push(eq(jobs.barId, barId))
    }

    let result
    if (conditions.length > 0) {
      result = await query.where(and(...conditions)).orderBy(jobs.date)
    } else {
      result = await query.orderBy(jobs.date)
    }

    return NextResponse.json({
      jobs: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/jobs - Create new job
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      barId,
      title,
      description,
      date,
      timeSlot,
      requiredCount,
      requirements,
      compensationType,
      cashAmount,
      drinksValue,
      totalValue,
      minFollowers,
      viaTeam,
    } = body

    // Validation
    if (!barId || !title || !date || !compensationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create job
    const [job] = await db
      .insert(jobs)
      .values({
        barId,
        title,
        description,
        date: new Date(date),
        timeSlot,
        requiredCount: requiredCount || 1,
        requirements: requirements || {
          storyCount: 3,
          mustTagBar: true,
          mustEnableLocation: true,
          mustShowDrink: true,
        },
        compensationType,
        cashAmount: cashAmount?.toFixed(2) || '0',
        drinksValue: drinksValue?.toFixed(2) || '0',
        totalValue: totalValue?.toFixed(2) || '0',
        minFollowers: minFollowers || 0,
        viaTeam: viaTeam || false,
        status: 'open',
      })
      .returning()

    return NextResponse.json({
      success: true,
      job,
      message: 'สร้างงานสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

