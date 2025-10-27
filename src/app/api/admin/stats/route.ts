import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, jobs, applications, transactions, seatBookings } from '@/db/schema'
import { eq, sql, and, gte } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/admin/stats - สถิติสำหรับ Admin Dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // นับจำนวนผู้ใช้แต่ละประเภท
    const [influencerCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'influencer'))

    const [barCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'bar'))

    const [totalUsersCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    // นับจำนวนงาน
    const [totalJobsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)

    const [activeJobsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(eq(jobs.status, 'open'))

    const [completedJobsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(eq(jobs.status, 'completed'))

    // คำนวณรายได้ Platform
    const [platformRevenue] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS NUMERIC)), 0)` 
      })
      .from(transactions)
      .where(eq(transactions.type, 'commission'))

    // นับ Seat Bookings
    const [totalBookingsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(seatBookings)

    const [activeBookingsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(seatBookings)
      .where(
        sql`${seatBookings.status} IN ('pending', 'confirmed', 'keeper_arrived')`
      )

    // รายได้รวมที่จ่ายให้ Influencers
    const [totalPaidToInfluencers] = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(CAST(${transactions.amount} AS NUMERIC)), 0)` 
      })
      .from(transactions)
      .where(eq(transactions.type, 'job_received'))

    // Growth - เปรียบเทียบกับเดือนที่แล้ว
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const [newUsersThisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, lastMonth))

    const [newJobsThisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobs)
      .where(gte(jobs.createdAt, lastMonth))

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: Number(totalUsersCount?.count || 0),
          influencers: Number(influencerCount?.count || 0),
          bars: Number(barCount?.count || 0),
          newThisMonth: Number(newUsersThisMonth?.count || 0),
        },
        jobs: {
          total: Number(totalJobsCount?.count || 0),
          active: Number(activeJobsCount?.count || 0),
          completed: Number(completedJobsCount?.count || 0),
          newThisMonth: Number(newJobsThisMonth?.count || 0),
        },
        bookings: {
          total: Number(totalBookingsCount?.count || 0),
          active: Number(activeBookingsCount?.count || 0),
        },
        revenue: {
          platform: Number(platformRevenue?.total || 0),
          paidToInfluencers: Number(totalPaidToInfluencers?.total || 0),
        },
      }
    })
  } catch (error) {
    console.error('Get admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}

