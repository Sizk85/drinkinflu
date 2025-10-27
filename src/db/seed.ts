import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const client = postgres(connectionString)
const db = drizzle(client, { schema })

async function seed() {
  console.log('🌱 Seeding database...')

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const [admin] = await db.insert(schema.users).values({
      email: 'admin@drinkinflu.com',
      passwordHash: adminPassword,
      name: 'Admin',
      role: 'admin',
      handle: 'admin',
    }).returning()
    console.log('✅ Admin user created')

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
        bio: 'RCA\'s legendary nightclub 🎉',
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
        bio: 'Dark vibes, strong drinks 🍻',
      },
      {
        email: 'illuzion@bar.com',
        passwordHash: barPassword,
        name: 'Illuzion',
        role: 'bar',
        handle: 'illuzion_phuket',
        barName: 'Illuzion Phuket',
        barZone: 'ภูเก็ต',
        barLocation: 'Bangla Road, Patong',
        barMusicStyle: 'EDM, Commercial',
        walletBalance: '100000.00',
        bio: 'Phuket\'s biggest nightclub 🏝️',
      },
    ]).returning()
    console.log('✅ Bar users created')

    // Create influencer users
    const influencerPassword = await bcrypt.hash('influ123', 10)
    const influencers = await db.insert(schema.users).values([
      {
        email: 'bella@influ.com',
        passwordHash: influencerPassword,
        name: 'Bella Nightlife',
        role: 'influencer',
        handle: 'bella_nightlife',
        igUsername: 'bella.nightlife',
        igFollowers: 15000,
        igReachAvg: 8000,
        city: 'กรุงเทพฯ',
        zones: ['ทองหล่อ', 'RCA', 'เอกมัย'],
        rating: '4.8',
        totalJobs: 45,
        isPremium: true,
        bio: 'Bangkok nightlife enthusiast',
      },
      {
        email: 'max@influ.com',
        passwordHash: influencerPassword,
        name: 'Max Party',
        role: 'influencer',
        handle: 'maxparty',
        igUsername: 'max.party',
        igFollowers: 8000,
        igReachAvg: 4000,
        city: 'กรุงเทพฯ',
        zones: ['RCA', 'สุขุมวิท'],
        rating: '4.5',
        totalJobs: 28,
        bio: 'Living for the weekend 🎊',
      },
      {
        email: 'nina@influ.com',
        passwordHash: influencerPassword,
        name: 'Nina Chill',
        role: 'influencer',
        handle: 'nina_chill',
        igUsername: 'nina.chill',
        igFollowers: 12000,
        igReachAvg: 6000,
        city: 'ภูเก็ต',
        zones: ['ป่าตอง', 'กะตะ'],
        rating: '4.9',
        totalJobs: 52,
        isPremium: true,
        bio: 'Phuket party girl 🏖️🍹',
      },
      {
        email: 'jay@influ.com',
        passwordHash: influencerPassword,
        name: 'Jay Vibes',
        role: 'influencer',
        handle: 'jayvibes',
        igUsername: 'jay.vibes',
        igFollowers: 5000,
        igReachAvg: 2500,
        city: 'กรุงเทพฯ',
        zones: ['ทองหล่อ'],
        rating: '4.3',
        totalJobs: 15,
        bio: 'Good vibes only 🎵',
      },
    ]).returning()
    console.log('✅ Influencer users created')

    // Create a team (Mom with members)
    const [team] = await db.insert(schema.teams).values({
      ownerId: influencers[0].id, // Bella is the mom
      name: 'Bella\'s Squad',
      description: 'Premium nightlife influencers',
      commissionRate: '0.15',
    }).returning()

    await db.insert(schema.teamMembers).values([
      {
        teamId: team.id,
        influencerId: influencers[1].id, // Max
        sharePercentage: '0.85', // 85% after mom's 15%
      },
      {
        teamId: team.id,
        influencerId: influencers[3].id, // Jay
        sharePercentage: '0.85',
      },
    ])
    console.log('✅ Team created')

    // Create jobs
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(20, 0, 0, 0)

    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(21, 0, 0, 0)

    const jobs = await db.insert(schema.jobs).values([
      {
        barId: bars[0].id, // Route 66
        title: 'Friday Night Party @ Route 66',
        description: 'มาปาร์ตี้วันศุกร์ที่ Route 66 กันเถอะ! เพลงดี บรรยากาศเจ๋ง',
        date: tomorrow,
        timeSlot: '20:00-02:00',
        requiredCount: 5,
        requirements: {
          storyCount: 3,
          mustTagBar: true,
          mustEnableLocation: true,
          mustShowDrink: true,
        },
        compensationType: 'both',
        cashAmount: '800.00',
        drinksValue: '500.00',
        totalValue: '1300.00',
        minFollowers: 3000,
        viaTeam: false,
        status: 'open',
      },
      {
        barId: bars[1].id, // Demon Bar
        title: 'Techno Night @ Demon Bar',
        description: 'Techno lovers unite! Underground vibes 🎧',
        date: tomorrow,
        timeSlot: '22:00-03:00',
        requiredCount: 3,
        requirements: {
          storyCount: 2,
          mustTagBar: true,
          mustEnableLocation: true,
          mustShowDrink: false,
        },
        compensationType: 'cash',
        cashAmount: '1000.00',
        drinksValue: '0',
        totalValue: '1000.00',
        minFollowers: 5000,
        viaTeam: false,
        status: 'open',
      },
      {
        barId: bars[2].id, // Illuzion
        title: 'Weekend Madness @ Illuzion Phuket',
        description: 'The biggest party in Phuket! 🏝️🔥',
        date: nextWeek,
        timeSlot: '23:00-04:00',
        requiredCount: 10,
        requirements: {
          storyCount: 5,
          mustTagBar: true,
          mustEnableLocation: true,
          mustShowDrink: true,
        },
        compensationType: 'both',
        cashAmount: '1500.00',
        drinksValue: '1000.00',
        totalValue: '2500.00',
        minFollowers: 10000,
        viaTeam: true,
        status: 'open',
      },
    ]).returning()
    console.log('✅ Jobs created')

    // Create some applications
    await db.insert(schema.applications).values([
      {
        jobId: jobs[0].id,
        influencerId: influencers[0].id,
        status: 'accepted',
        verificationStatus: 'pending_proof',
      },
      {
        jobId: jobs[0].id,
        influencerId: influencers[1].id,
        status: 'accepted',
        verificationStatus: 'pending_proof',
      },
      {
        jobId: jobs[1].id,
        influencerId: influencers[2].id,
        status: 'pending',
      },
    ])
    console.log('✅ Applications created')

    // Create some transactions
    await db.insert(schema.transactions).values([
      {
        userId: bars[0].id,
        type: 'topup',
        amount: '50000.00',
        balanceBefore: '0',
        balanceAfter: '50000.00',
        description: 'เติมเงินเริ่มต้น',
      },
      {
        userId: bars[1].id,
        type: 'topup',
        amount: '30000.00',
        balanceBefore: '0',
        balanceAfter: '30000.00',
        description: 'เติมเงินเริ่มต้น',
      },
      {
        userId: bars[2].id,
        type: 'topup',
        amount: '100000.00',
        balanceBefore: '0',
        balanceAfter: '100000.00',
        description: 'เติมเงินเริ่มต้น',
      },
    ])
    console.log('✅ Transactions created')

    // Create seat keepers
    const seatKeepers = await db.insert(schema.seatKeepers).values([
      {
        userId: influencers[0].id, // Bella
        isActive: true,
        availableZones: ['ทองหล่อ', 'RCA', 'เอกมัย'],
        hourlyRate: '200',
        totalEarnings: '4500',
        totalBookings: 12,
        rating: '4.8',
      },
      {
        userId: influencers[1].id, // Max
        isActive: true,
        availableZones: ['RCA', 'สุขุมวิท'],
        hourlyRate: '150',
        totalEarnings: '2100',
        totalBookings: 7,
        rating: '4.5',
      },
    ]).returning()
    console.log('✅ Seat Keepers created')

    // Create seat bookings
    const tomorrow2 = new Date()
    tomorrow2.setDate(tomorrow2.getDate() + 1)
    tomorrow2.setHours(21, 0, 0, 0)

    const customerArrival = new Date(tomorrow2)
    customerArrival.setHours(23, 0, 0, 0)

    await db.insert(schema.seatBookings).values([
      {
        customerId: influencers[3].id, // Jay as customer
        seatKeeperId: seatKeepers[0].id,
        venueName: 'Demon Bar',
        venueZone: 'ทองหล่อ',
        venueAddress: 'ทองหล่อ 11, กรุงเทพฯ',
        keeperStartTime: tomorrow2,
        customerArrivalTime: customerArrival,
        numberOfSeats: 2,
        hourlyRate: '200',
        totalHours: '2',
        keeperFee: '400',
        platformFee: '100',
        totalAmount: '500',
        status: 'confirmed',
      },
    ])
    console.log('✅ Seat Bookings created')

    console.log('🎉 Seeding completed successfully!')
    console.log('\n📋 Test Accounts:')
    console.log('Admin: admin@drinkinflu.com / admin123')
    console.log('Bar: route66@bar.com / bar123')
    console.log('Influencer: bella@influ.com / influ123')
    console.log('\n[Seat Keeper]')
    console.log('Bella is also a Seat Keeper (200฿/hr)')
    console.log('Max is also a Seat Keeper (150฿/hr)')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await client.end()
  }
}

seed()

