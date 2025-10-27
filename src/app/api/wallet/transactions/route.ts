import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, transactions } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ transactions: [] })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1)

    if (!user) {
      return NextResponse.json({ transactions: [] })
    }

    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, user.id))
      .orderBy(desc(transactions.createdAt))
      .limit(20)

    return NextResponse.json({
      success: true,
      transactions: userTransactions,
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json({ transactions: [] })
  }
}

