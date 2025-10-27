import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

// GET admin user info
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    // ต้อง login เป็น admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // ดึงข้อมูล admin
    const adminUser = await db.query.users.findFirst({
      where: eq(users.email, 'admin@drinkinflu.com'),
    })

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        handle: adminUser.handle,
        walletBalance: adminUser.walletBalance,
        createdAt: adminUser.createdAt,
      }
    })
  } catch (error) {
    console.error('Get admin info error:', error)
    return NextResponse.json(
      { error: 'Failed to get admin info' },
      { status: 500 }
    )
  }
}

