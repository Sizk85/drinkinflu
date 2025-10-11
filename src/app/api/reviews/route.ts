import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { reviews, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

/**
 * GET /api/reviews - List reviews
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')
    const revieweeId = searchParams.get('revieweeId')

    const query = db.select().from(reviews).$dynamic()

    const conditions = []
    if (jobId) {
      conditions.push(eq(reviews.jobId, jobId))
    }
    if (revieweeId) {
      conditions.push(eq(reviews.revieweeId, revieweeId))
    }

    let result
    if (conditions.length > 0) {
      result = await query.where(and(...conditions))
    } else {
      result = await query
    }

    return NextResponse.json({
      reviews: result,
      count: result.length,
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reviews - Create new review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, applicationId, reviewerId, revieweeId, rating, comment } = body

    if (!jobId || !reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const [review] = await db
      .insert(reviews)
      .values({
        jobId,
        applicationId: applicationId || null,
        reviewerId,
        revieweeId,
        rating,
        comment,
      })
      .returning()

    return NextResponse.json({
      success: true,
      review,
      message: 'รีวิวสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

