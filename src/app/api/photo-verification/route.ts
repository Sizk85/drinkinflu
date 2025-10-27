import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { seatBookings, keeperVerifications } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/auth'

// AI Photo Verification สำหรับ Check-in
// ในเวอร์ชันจริงจะใช้ Computer Vision API เช่น AWS Rekognition หรือ Google Cloud Vision

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageUrl, bookingId, verificationType } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // ตรวจสอบรูปด้วย AI (Placeholder - ในการใช้งานจริงจะเรียก AI API)
    const aiAnalysis = await performPhotoVerification(imageUrl, verificationType)

    // บันทึกผลการตรวจสอบ
    if (bookingId && verificationType === 'checkin') {
      await db.update(seatBookings)
        .set({
          keeperCheckInProof: imageUrl,
          keeperCheckInTime: new Date(),
        })
        .where(eq(seatBookings.id, bookingId))
    }

    return NextResponse.json({
      success: true,
      verification: aiAnalysis,
      message: aiAnalysis.isValid ? 'Photo verified successfully' : 'Photo verification failed',
    })
  } catch (error) {
    console.error('Photo verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify photo' },
      { status: 500 }
    )
  }
}

// AI Photo Verification Logic
async function performPhotoVerification(imageUrl: string, verificationType: string) {
  // ในเวอร์ชันจริงจะเรียก API เช่น:
  // - AWS Rekognition: ตรวจจับใบหน้า, วัตถุ, ข้อความในรูป
  // - Google Cloud Vision: ตรวจสอบเนื้อหารูป, OCR
  // - Azure Computer Vision: วิเคราะห์รูปภาพ

  // Placeholder: สุ่มผลลัพธ์
  const score = Math.random() * 100

  if (verificationType === 'checkin') {
    return {
      isValid: score > 30, // 70% โอกาสผ่าน
      score: Math.round(score),
      details: {
        hasFace: score > 40,
        hasVenueLogo: score > 50,
        hasTable: score > 45,
        lighting: score > 60 ? 'good' : 'poor',
        quality: score > 70 ? 'high' : 'medium',
      },
      confidence: Math.round(score),
      timestamp: new Date().toISOString(),
    }
  }

  if (verificationType === 'id_card') {
    return {
      isValid: score > 40,
      score: Math.round(score),
      details: {
        hasIdCard: score > 50,
        textDetected: score > 60,
        faceMatches: score > 70,
      },
      confidence: Math.round(score),
      timestamp: new Date().toISOString(),
    }
  }

  return {
    isValid: score > 50,
    score: Math.round(score),
    confidence: Math.round(score),
    timestamp: new Date().toISOString(),
  }
}

// GET - ดูประวัติการยืนยันรูป
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const bookingId = searchParams.get('bookingId')

    if (bookingId) {
      const booking = await db.query.seatBookings.findFirst({
        where: eq(seatBookings.id, bookingId),
      })

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        hasProof: !!booking.keeperCheckInProof,
        proofUrl: booking.keeperCheckInProof,
        checkedInAt: booking.keeperCheckInTime,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Photo verification API ready',
    })
  } catch (error) {
    console.error('Get verification error:', error)
    return NextResponse.json(
      { error: 'Failed to get verification' },
      { status: 500 }
    )
  }
}

