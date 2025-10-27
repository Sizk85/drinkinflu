import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { keeperVerifications, seatKeepers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

// GET /api/keeper-verifications?keeperId=xxx - ดูสถานะการยืนยัน
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const keeperId = searchParams.get('keeperId')

    if (!keeperId) {
      return NextResponse.json({ error: 'Keeper ID required' }, { status: 400 })
    }

    const verifications = await db.query.keeperVerifications.findMany({
      where: eq(keeperVerifications.keeperId, keeperId),
      orderBy: (keeperVerifications, { desc }) => [desc(keeperVerifications.createdAt)]
    })

    return NextResponse.json({
      success: true,
      verifications,
    })
  } catch (error) {
    console.error('Get verifications error:', error)
    return NextResponse.json(
      { error: 'Failed to get verifications' },
      { status: 500 }
    )
  }
}

// POST /api/keeper-verifications - ส่งคำขอยืนยันตัวตน
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { keeperId, verificationType, documentUrl, idCardNumber, phoneNumber } = body

    if (!keeperId || !verificationType) {
      return NextResponse.json(
        { error: 'Keeper ID and verification type are required' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่า Keeper นี้มีอยู่จริง
    const keeper = await db.query.seatKeepers.findFirst({
      where: eq(seatKeepers.id, keeperId),
      with: {
        user: true
      }
    })

    if (!keeper) {
      return NextResponse.json({ error: 'Seat keeper not found' }, { status: 404 })
    }

    // ตรวจสอบว่าเป็นเจ้าของ Keeper profile
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser || keeper.userId !== currentUser.id) {
      return NextResponse.json(
        { error: 'Unauthorized to verify this keeper' },
        { status: 403 }
      )
    }

    // สร้างคำขอยืนยัน
    const [verification] = await db.insert(keeperVerifications).values({
      keeperId,
      verificationType,
      documentUrl: documentUrl || null,
      idCardNumber: idCardNumber || null,
      phoneNumber: phoneNumber || null,
      phoneVerified: verificationType === 'phone' && phoneNumber ? true : false,
      status: 'pending',
    }).returning()

    // อัพเดทสถานะ Keeper
    await db.update(seatKeepers)
      .set({ 
        verificationStatus: 'pending',
      })
      .where(eq(seatKeepers.id, keeperId))

    return NextResponse.json({
      success: true,
      verification,
      message: 'Verification request submitted successfully',
    })
  } catch (error) {
    console.error('Submit verification error:', error)
    return NextResponse.json(
      { error: 'Failed to submit verification' },
      { status: 500 }
    )
  }
}

// PATCH /api/keeper-verifications - อนุมัติ/ปฏิเสธการยืนยัน (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ตรวจสอบว่าเป็น admin
    const currentUser = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    })

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { verificationId, status, rejectionReason } = body

    if (!verificationId || !status) {
      return NextResponse.json(
        { error: 'Verification ID and status are required' },
        { status: 400 }
      )
    }

    // อัพเดทสถานะการยืนยัน
    const [updated] = await db.update(keeperVerifications)
      .set({
        status,
        verifiedBy: currentUser.id,
        verifiedAt: new Date(),
        rejectionReason: status === 'rejected' ? rejectionReason : null,
      })
      .where(eq(keeperVerifications.id, verificationId))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: 'Verification not found' }, { status: 404 })
    }

    // อัพเดทสถานะ Keeper
    if (status === 'approved') {
      const keeper = await db.query.seatKeepers.findFirst({
        where: eq(seatKeepers.id, updated.keeperId),
      })

      if (keeper) {
        // เพิ่ม badge
        const currentBadges = keeper.verifiedBadges || []
        const badgeType = updated.verificationType === 'id_card' ? 'id_verified' : 
                         updated.verificationType === 'phone' ? 'phone_verified' : 
                         'verified'
        
        const newBadges = [...currentBadges]
        if (!newBadges.includes(badgeType)) {
          newBadges.push(badgeType)
        }

        // ตรวจสอบว่าผ่านการยืนยันครบหรือยัง
        const allVerifications = await db.query.keeperVerifications.findMany({
          where: eq(keeperVerifications.keeperId, updated.keeperId),
        })

        const hasIdVerification = allVerifications.some(v => 
          v.verificationType === 'id_card' && v.status === 'approved'
        )
        const hasPhoneVerification = allVerifications.some(v => 
          v.verificationType === 'phone' && v.status === 'approved'
        )

        const isFullyVerified = hasIdVerification && hasPhoneVerification

        await db.update(seatKeepers)
          .set({
            verificationStatus: isFullyVerified ? 'verified' : 'pending',
            isVerified: isFullyVerified,
            verifiedBadges: newBadges,
          })
          .where(eq(seatKeepers.id, updated.keeperId))
      }
    } else if (status === 'rejected') {
      await db.update(seatKeepers)
        .set({ verificationStatus: 'rejected' })
        .where(eq(seatKeepers.id, updated.keeperId))
    }

    return NextResponse.json({
      success: true,
      verification: updated,
    })
  } catch (error) {
    console.error('Update verification error:', error)
    return NextResponse.json(
      { error: 'Failed to update verification' },
      { status: 500 }
    )
  }
}

