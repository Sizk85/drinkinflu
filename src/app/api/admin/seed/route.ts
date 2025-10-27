import { NextRequest, NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/db/schema'
import bcrypt from 'bcryptjs'

// API endpoint สำหรับ seed data (Admin only)
export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ secret key
    const { secret } = await request.json()
    
    const MIGRATION_SECRET = process.env.MIGRATION_SECRET || 'drinkinflu-migration-secret'
    
    if (secret !== MIGRATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Seeding database...')

    const connectionString = process.env.DATABASE_URL!
    const client = postgres(connectionString)
    const db = drizzle(client, { schema })

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const [admin] = await db.insert(schema.users).values({
      email: 'admin@drinkinflu.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'admin',
      handle: 'admin',
    }).returning()

    // Create bar users
    const barPassword = await bcrypt.hash('bar123', 10)
    const bars = await db.insert(schema.users).values([
      {
        email: 'route66@bar.com',
        passwordHash: barPassword,
        name: 'Route 66',
        role: 'bar',
        handle: 'route66',
        barName: 'Route 66 Club',
        barZone: 'RCA',
        barLocation: 'RCA Plaza, กรุงเทพฯ',
        barMusicStyle: 'EDM, Hip Hop',
        walletBalance: '50000.00',
        bio: 'RCA legendary nightclub',
      },
      {
        email: 'demon@bar.com',
        passwordHash: barPassword,
        name: 'Demon Bar',
        role: 'bar',
        handle: 'demonbar',
        barName: 'Demon Bar',
        barZone: 'ทองหล่อ',
        barLocation: 'ทองหล่อ 11, กรุงเทพฯ',
        barMusicStyle: 'Techno, House',
        walletBalance: '30000.00',
        bio: 'Underground techno paradise',
      },
    ]).returning()

    // Create influencer users
    const influencerPassword = await bcrypt.hash('influ123', 10)
    const influencers = await db.insert(schema.users).values([
      {
        email: 'bella@influ.com',
        passwordHash: influencerPassword,
        name: 'Bella Night',
        role: 'influencer',
        handle: 'bellanight',
        igUsername: '@bellanight',
        igFollowers: 12500,
        igReachAvg: 8000,
        city: 'กรุงเทพฯ',
        zones: ['ทองหล่อ', 'RCA', 'เอกมัย'],
        rating: '4.8',
        totalJobs: 45,
        isPremium: true,
        walletBalance: '15000.00',
        bio: 'Bangkok nightlife enthusiast',
      },
      {
        email: 'max@influ.com',
        passwordHash: influencerPassword,
        name: 'Max Party',
        role: 'influencer',
        handle: 'maxparty',
        igUsername: '@maxparty',
        igFollowers: 8500,
        igReachAvg: 5000,
        city: 'กรุงเทพฯ',
        zones: ['RCA', 'สุขุมวิท'],
        rating: '4.5',
        totalJobs: 28,
        isPremium: false,
        walletBalance: '8500.00',
        bio: 'Party lover and content creator',
      },
    ]).returning()

    await client.end()

    console.log('Seeding completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      created: {
        admin: 1,
        bars: bars.length,
        influencers: influencers.length,
      }
    })
  } catch (error: any) {
    console.error('Seeding failed:', error)
    return NextResponse.json(
      { 
        error: 'Seeding failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

