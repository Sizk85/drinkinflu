import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { applications } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * POST /api/verify - Verify influencer's post (AI placeholder)
 * 
 * This is a placeholder for AI verification logic.
 * In production, this would:
 * 1. Accept Instagram post URLs or screenshot uploads
 * 2. Use AI/CV to verify:
 *    - Bar is tagged
 *    - Location is enabled
 *    - Required number of stories
 *    - Drinks are shown (if required)
 * 3. Calculate an AI score
 * 4. Auto-approve if score > threshold, or flag for manual review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, proofUrls } = body

    // Validation
    if (!applicationId || !proofUrls || !Array.isArray(proofUrls)) {
      return NextResponse.json(
        { error: 'applicationId and proofUrls array are required' },
        { status: 400 }
      )
    }

    // Get application
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .limit(1)

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Mock AI verification
    // In production, this would call actual AI/CV service
    const mockAiScore = Math.random() * 100
    const mockVerification = {
      ig_tagged: mockAiScore > 30,
      location_ok: mockAiScore > 40,
      story_count: proofUrls.length,
      reasons: mockAiScore < 70 ? ['ภาพไม่ชัดเจน', 'ไม่มั่นใจว่าเป็นร้านที่ถูกต้อง'] : [],
    }

    // Determine verification status
    let verificationStatus = 'ai_checking'
    if (mockAiScore >= 85) {
      verificationStatus = 'auto_pass'
    } else if (mockAiScore >= 70) {
      verificationStatus = 'manual_review'
    } else {
      verificationStatus = 'rejected'
    }

    // Update application
    const [updated] = await db
      .update(applications)
      .set({
        proofUrls,
        verificationStatus,
        aiScore: mockAiScore.toFixed(2),
        verificationDetails: mockVerification,
        verifiedAt: verificationStatus === 'auto_pass' ? new Date() : null,
      })
      .where(eq(applications.id, applicationId))
      .returning()

    return NextResponse.json({
      success: true,
      application: updated,
      aiScore: mockAiScore.toFixed(2),
      verification: mockVerification,
      status: verificationStatus,
      message:
        verificationStatus === 'auto_pass'
          ? 'ตรวจสอบผ่านอัตโนมัติ!'
          : verificationStatus === 'manual_review'
          ? 'รอตรวจสอบด้วยตนเอง'
          : 'ไม่ผ่านการตรวจสอบ',
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/verify/:id - Manual approval/rejection
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, approved, reason } = body

    if (!applicationId || approved === undefined) {
      return NextResponse.json(
        { error: 'applicationId and approved are required' },
        { status: 400 }
      )
    }

    const verificationStatus = approved ? 'approved' : 'rejected'

    // Get existing application first
    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .limit(1)

    const [updated] = await db
      .update(applications)
      .set({
        verificationStatus,
        verifiedAt: approved ? new Date() : null,
        verificationDetails: {
          ...((existing?.verificationDetails as any) || {}),
          manual_review_reason: reason,
        },
      })
      .where(eq(applications.id, applicationId))
      .returning()

    return NextResponse.json({
      success: true,
      application: updated,
      message: approved ? 'อนุมัติสำเร็จ' : 'ปฏิเสธสำเร็จ',
    })
  } catch (error) {
    console.error('Manual verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

