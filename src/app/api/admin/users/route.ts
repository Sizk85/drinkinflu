import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/admin/users - ดูรายการผู้ใช้ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role')

    let query: any = db.select().from(users)

    if (role && role !== 'all') {
      query = query.where(eq(users.role, role))
    }

    const allUsers = await query.orderBy(desc(users.createdAt))

    return NextResponse.json({
      success: true,
      users: allUsers,
      total: allUsers.length,
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    )
  }
}

