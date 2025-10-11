import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { subscriptions } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * GET /api/subscriptions - Get user's subscriptions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))

    const activeSub = userSubs.find(
      (sub) => sub.status === 'active' && new Date(sub.endDate) > new Date()
    )

    return NextResponse.json({
      subscriptions: userSubs,
      active: activeSub || null,
    })
  } catch (error) {
    console.error('Get subscriptions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/subscriptions - Create new subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, plan, durationMonths = 1 } = body

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'userId and plan are required' },
        { status: 400 }
      )
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + durationMonths)

    const planPrices: Record<string, number> = {
      bar_basic: 990,
      bar_pro: 2490,
      bar_business: 4990,
      influencer_premium: 299,
    }

    const amount = planPrices[plan] || 0

    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        plan,
        status: 'active',
        startDate,
        endDate,
        amount: amount.toFixed(2),
      })
      .returning()

    return NextResponse.json({
      success: true,
      subscription,
      message: 'สมัครแพ็กเกจสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Create subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

