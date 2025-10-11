import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users, transactions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { calcWithdrawal } from '@/lib/pricing'

/**
 * Mock Payment Withdrawal Endpoint
 * Simulates withdrawing funds from a user's wallet with fee
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount } = body

    // Validation
    if (!userId || !amount) {
      return NextResponse.json(
        { error: 'userId and amount are required' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Get current user
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const currentBalance = parseFloat(user.walletBalance || '0')

    // Check sufficient balance
    if (currentBalance < amount) {
      return NextResponse.json(
        { error: 'ยอดเงินไม่เพียงพอ' },
        { status: 400 }
      )
    }

    // Calculate withdrawal with fee
    const withdrawal = calcWithdrawal(amount)
    const newBalance = currentBalance - amount

    // Update wallet balance
    await db
      .update(users)
      .set({ walletBalance: newBalance.toFixed(2) })
      .where(eq(users.id, userId))

    // Create transaction record
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: 'withdrawal',
        amount: `-${amount.toFixed(2)}`,
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        description: `ถอนเงิน (ค่าธรรมเนียม ${withdrawal.fee} บาท)`,
        metadata: {
          requestedAmount: withdrawal.requestedAmount,
          fee: withdrawal.fee,
          receivedAmount: withdrawal.receivedAmount,
        },
        status: 'completed',
      })
      .returning()

    return NextResponse.json({
      success: true,
      transaction,
      newBalance: newBalance.toFixed(2),
      receivedAmount: withdrawal.receivedAmount,
      fee: withdrawal.fee,
      message: 'ถอนเงินสำเร็จ',
    })
  } catch (error) {
    console.error('Withdrawal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

