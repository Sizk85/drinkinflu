import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      role = 'influencer',
      // Bar fields
      barName,
      barZone,
      barLocation,
      barMusicStyle,
      // Influencer fields
      igUsername,
      igFollowers,
      city,
      zones,
    } = body

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร' },
        { status: 400 }
      )
    }

    // Validate role-specific fields
    if (role === 'bar' && !barName) {
      return NextResponse.json(
        { error: 'กรุณาระบุชื่อร้าน' },
        { status: 400 }
      )
    }

    if (role === 'influencer' && !igUsername) {
      return NextResponse.json(
        { error: 'กรุณาระบุ Instagram username' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้มีในระบบแล้ว' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate handle from name
    const baseHandle = (role === 'bar' ? barName : name)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20)
    const handle = baseHandle + Math.random().toString(36).substring(2, 6)

    // สร้าง user object ตามบทบาท
    const userData: any = {
      email,
      passwordHash,
      name,
      role,
      handle,
      walletBalance: role === 'bar' ? '50000' : '0', // ร้านได้เงินเริ่มต้น 50,000
    }

    // เพิ่มข้อมูลสำหรับ Bar
    if (role === 'bar') {
      userData.barName = barName
      userData.barZone = barZone
      userData.barLocation = barLocation || null
      userData.barMusicStyle = barMusicStyle || null
    }

    // เพิ่มข้อมูลสำหรับ Influencer
    if (role === 'influencer') {
      userData.igUsername = igUsername
      userData.igFollowers = igFollowers || 0
      userData.igReachAvg = igFollowers ? Math.round(igFollowers * 0.6) : 0 // ประมาณ 60% ของ followers
      userData.city = city
      userData.zones = zones || []
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values(userData)
      .returning()

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        handle: newUser.handle,
      },
      message: 'สมัครสมาชิกสำเร็จ',
    }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' },
      { status: 500 }
    )
  }
}

