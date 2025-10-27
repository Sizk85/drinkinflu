import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ balance: 0 })
    }

    const [user] = await db
      .select({ walletBalance: users.walletBalance })
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    return NextResponse.json({
      success: true,
      balance: parseFloat(user?.walletBalance || '0'),
    })
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json({ balance: 0 })
  }
}

