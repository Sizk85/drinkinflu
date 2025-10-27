import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { chatMessages, seatBookings, users } from '@/db/schema'
import { eq, and, or, desc } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/chat?bookingId=xxx - ดูข้อความในการจอง
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const bookingId = searchParams.get('bookingId')

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 })
    }

    // ตรวจสอบว่าผู้ใช้เป็นส่วนหนึ่งของการจองนี้
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

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

    // ตรวจสอบว่าเป็นลูกค้าหรือ Keeper
    const isCustomer = booking.customerId === currentUser.id
    const isKeeper = booking.seatKeeper?.userId === currentUser.id

    if (!isCustomer && !isKeeper) {
      return NextResponse.json({ error: 'Unauthorized to view this chat' }, { status: 403 })
    }

    // ดึงข้อความทั้งหมด
    const messages = await db.query.chatMessages.findMany({
      where: eq(chatMessages.bookingId, bookingId),
      orderBy: [desc(chatMessages.createdAt)],
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    })

    // อัพเดทสถานะอ่านแล้ว
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.bookingId, bookingId),
          eq(chatMessages.receiverId, currentUser.id)
        )
      )

    return NextResponse.json({ 
      success: true, 
      messages: messages.reverse(), // เรียงจากเก่าไปใหม่
      booking
    })
  } catch (error) {
    console.error('Get chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat - ส่งข้อความใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, message } = body

    if (!bookingId || !message?.trim()) {
      return NextResponse.json(
        { error: 'Booking ID and message are required' },
        { status: 400 }
      )
    }

    // หาผู้ใช้ปัจจุบัน
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

    // กำหนดผู้รับ
    let receiverId: string
    if (booking.customerId === currentUser.id) {
      // ลูกค้าส่งหา Keeper
      if (!booking.seatKeeper?.userId) {
        return NextResponse.json(
          { error: 'No seat keeper assigned yet' },
          { status: 400 }
        )
      }
      receiverId = booking.seatKeeper.userId
    } else if (booking.seatKeeper?.userId === currentUser.id) {
      // Keeper ส่งหาลูกค้า
      receiverId = booking.customerId
    } else {
      return NextResponse.json(
        { error: 'Unauthorized to send message' },
        { status: 403 }
      )
    }

    // สร้างข้อความใหม่
    const [newMessage] = await db.insert(chatMessages).values({
      bookingId,
      senderId: currentUser.id,
      receiverId,
      message: message.trim(),
    }).returning()

    // ดึงข้อมูลข้อความพร้อม sender
    const messageWithSender = await db.query.chatMessages.findFirst({
      where: eq(chatMessages.id, newMessage.id),
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: messageWithSender,
    })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

