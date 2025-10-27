import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { transactions } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/admin/transactions - ดูธุรกรรมทั้งหมด (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100')
    const type = searchParams.get('type')

    let query = db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(limit)

    if (type) {
      query = query.where(eq(transactions.type, type)) as any
    }

    const allTransactions = await query

    return NextResponse.json({
      success: true,
      transactions: allTransactions,
      total: allTransactions.length,
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Failed to get transactions' },
      { status: 500 }
    )
  }
}

