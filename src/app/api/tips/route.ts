import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { tips, seatBookings, users, transactions } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/tips?bookingId=xxx - ดูทิปของการจอง
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const bookingId = searchParams.get('bookingId')
    const userId = searchParams.get('userId') // ดูทิปทั้งหมดของ user

    let tipsData

    if (bookingId) {
      tipsData = await db.query.tips.findMany({
        where: eq(tips.bookingId, bookingId),
        with: {
          fromUser: {
            columns: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          },
          toUser: {
            columns: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          }
        }
      })
    } else if (userId) {
      // ดูทิปที่ได้รับ
      tipsData = await db.query.tips.findMany({
        where: eq(tips.toUserId, userId),
        with: {
          fromUser: {
            columns: {
              id: true,
              name: true,
              avatarUrl: true,
            }
          },
          booking: true
        },
        orderBy: (tips, { desc }) => [desc(tips.createdAt)]
      })
    } else {
      return NextResponse.json({ error: 'Booking ID or User ID required' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      tips: tipsData,
    })
  } catch (error) {
    console.error('Get tips error:', error)
    return NextResponse.json(
      { error: 'Failed to get tips' },
      { status: 500 }
    )
  }
}

// POST /api/tips - ให้ทิป
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, amount, message } = body

    if (!bookingId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Booking ID and valid amount are required' },
        { status: 400 }
      )
    }

    // หาผู้ใช้ปัจจุบัน (คนให้ทิป)
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // หาข้อมูลการจอง
    const booking = await db.query.seatBookings.findFirst({
      where: eq(seatBookings.id, bookingId),
      with: {
        seatKeeper: {
          with: {
            user: true
          }
        }
      }
    }) as any

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // ตรวจสอบว่าเป็นลูกค้าของการจองนี้
    if (booking.customerId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Only customer can give tips' },
        { status: 403 }
      )
    }

    // ตรวจสอบว่างานเสร็จแล้ว
    if (booking.status !== 'completed' && booking.status !== 'customer_arrived') {
      return NextResponse.json(
        { error: 'Booking must be completed before tipping' },
        { status: 400 }
      )
    }

    if (!booking.seatKeeper?.userId) {
      return NextResponse.json(
        { error: 'No seat keeper to tip' },
        { status: 400 }
      )
    }

    // ตรวจสอบ wallet balance
    const customerBalance = parseFloat(currentUser.walletBalance || '0')
    const tipAmount = parseFloat(amount)

    if (customerBalance < tipAmount) {
      return NextResponse.json(
        { error: 'Insufficient wallet balance' },
        { status: 400 }
      )
    }

    // ทำธุรกรรม
    const keeperUser = booking.seatKeeper.user
    const keeperBalance = parseFloat(keeperUser.walletBalance || '0')

    // หักเงินจากลูกค้า
    await db.update(users)
      .set({ walletBalance: (customerBalance - tipAmount).toFixed(2) })
      .where(eq(users.id, currentUser.id))

    // เพิ่มเงินให้ Keeper
    await db.update(users)
      .set({ walletBalance: (keeperBalance + tipAmount).toFixed(2) })
      .where(eq(users.id, keeperUser.id))

    // บันทึก transaction ลูกค้า
    await db.insert(transactions).values({
      userId: currentUser.id,
      type: 'job_payment',
      amount: (-tipAmount).toFixed(2),
      balanceBefore: customerBalance.toFixed(2),
      balanceAfter: (customerBalance - tipAmount).toFixed(2),
      description: `ทิปให้ Seat Keeper (Booking #${bookingId.slice(0, 8)})`,
      metadata: { bookingId, tipMessage: message },
    })

    // บันทึก transaction Keeper
    await db.insert(transactions).values({
      userId: keeperUser.id,
      type: 'job_received',
      amount: tipAmount.toFixed(2),
      balanceBefore: keeperBalance.toFixed(2),
      balanceAfter: (keeperBalance + tipAmount).toFixed(2),
      description: `ทิปจากลูกค้า (Booking #${bookingId.slice(0, 8)})`,
      metadata: { bookingId, tipMessage: message },
    })

    // บันทึกทิป
    const [newTip] = await db.insert(tips).values({
      bookingId,
      fromUserId: currentUser.id,
      toUserId: keeperUser.id,
      amount: tipAmount.toFixed(2),
      message: message || null,
      status: 'completed',
    }).returning()

    // อัพเดท totalTipsReceived ของ Keeper
    await db.execute(`
      UPDATE seat_keepers 
      SET total_tips_received = total_tips_received + ${tipAmount}
      WHERE user_id = '${keeperUser.id}'
    `)

    return NextResponse.json({
      success: true,
      tip: newTip,
      message: 'Tip sent successfully',
    })
  } catch (error) {
    console.error('Send tip error:', error)
    return NextResponse.json(
      { error: 'Failed to send tip' },
      { status: 500 }
    )
  }
}

