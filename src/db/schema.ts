import { pgTable, text, timestamp, integer, decimal, boolean, uuid, jsonb, varchar, index } from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'influencer', 'bar', 'admin'
  handle: text('handle').unique(), // @username
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  phone: text('phone'),
  
  // For influencers
  igUsername: text('ig_username'),
  igFollowers: integer('ig_followers'),
  igReachAvg: integer('ig_reach_avg'),
  city: text('city'),
  zones: jsonb('zones').$type<string[]>(), // ['ทองหล่อ', 'RCA']
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalJobs: integer('total_jobs').default(0),
  isPremium: boolean('is_premium').default(false),
  
  // For bars
  barName: text('bar_name'),
  barLogo: text('bar_logo'),
  barLocation: text('bar_location'),
  barZone: text('bar_zone'),
  barMusicStyle: text('bar_music_style'),
  barImages: jsonb('bar_images').$type<string[]>(),
  
  // Wallet
  walletBalance: decimal('wallet_balance', { precision: 10, scale: 2 }).default('0'),
  
  // Metadata
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    handleIdx: index('handle_idx').on(table.handle),
    emailIdx: index('email_idx').on(table.email),
  }
})

// Jobs table
export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  barId: uuid('bar_id').references(() => users.id).notNull(),
  
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date', { mode: 'date' }).notNull(),
  timeSlot: text('time_slot'), // '20:00-02:00'
  
  // Requirements
  requiredCount: integer('required_count').default(1),
  requirements: jsonb('requirements').$type<{
    storyCount: number
    mustTagBar: boolean
    mustEnableLocation: boolean
    mustShowDrink: boolean
  }>(),
  
  // Compensation
  compensationType: text('compensation_type').notNull(), // 'cash', 'drinks', 'both'
  cashAmount: decimal('cash_amount', { precision: 10, scale: 2 }),
  drinksValue: decimal('drinks_value', { precision: 10, scale: 2 }),
  totalValue: decimal('total_value', { precision: 10, scale: 2 }).notNull(),
  
  // Preferences
  preferredGender: text('preferred_gender'), // 'male', 'female', 'any'
  minFollowers: integer('min_followers'),
  viaTeam: boolean('via_team').default(false), // ผ่านโม or ตรง
  
  // Status
  status: text('status').notNull().default('open'), // 'open', 'in_progress', 'completed', 'cancelled'
  acceptedCount: integer('accepted_count').default(0),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    barIdIdx: index('bar_id_idx').on(table.barId),
    dateIdx: index('date_idx').on(table.date),
    statusIdx: index('status_idx').on(table.status),
  }
})

// Job Applications table
export const applications = pgTable('applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  influencerId: uuid('influencer_id').references(() => users.id).notNull(),
  teamId: uuid('team_id').references(() => teams.id),
  
  status: text('status').notNull().default('pending'), // 'pending', 'accepted', 'rejected', 'completed', 'cancelled'
  
  // Verification
  proofUrls: jsonb('proof_urls').$type<string[]>(),
  verificationStatus: text('verification_status'), // 'pending_proof', 'ai_checking', 'auto_pass', 'manual_review', 'approved', 'rejected'
  aiScore: decimal('ai_score', { precision: 3, scale: 2 }),
  verificationDetails: jsonb('verification_details').$type<{
    ig_tagged: boolean
    location_ok: boolean
    story_count: number
    reasons?: string[]
  }>(),
  verifiedAt: timestamp('verified_at', { mode: 'date' }),
  
  // Payment
  paymentStatus: text('payment_status').default('unpaid'), // 'unpaid', 'processing', 'paid'
  paymentAmount: decimal('payment_amount', { precision: 10, scale: 2 }),
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    jobIdIdx: index('job_id_idx').on(table.jobId),
    influencerIdIdx: index('influencer_id_idx').on(table.influencerId),
  }
})

// Teams table (for Moms/Managers)
export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  
  name: text('name').notNull(),
  description: text('description'),
  commissionRate: decimal('commission_rate', { precision: 3, scale: 2 }).default('0.15'), // 15% for mom
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

// Team Members table
export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  influencerId: uuid('influencer_id').references(() => users.id).notNull(),
  
  sharePercentage: decimal('share_percentage', { precision: 3, scale: 2 }).default('1.00'), // 100%
  status: text('status').default('active'), // 'active', 'inactive'
  
  joinedAt: timestamp('joined_at', { mode: 'date' }).defaultNow().notNull(),
})

// Transactions table (Wallet)
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  type: text('type').notNull(), // 'topup', 'withdrawal', 'job_payment', 'job_received', 'commission'
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  balanceBefore: decimal('balance_before', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }).notNull(),
  
  relatedJobId: uuid('related_job_id').references(() => jobs.id),
  relatedApplicationId: uuid('related_application_id').references(() => applications.id),
  
  description: text('description'),
  metadata: jsonb('metadata'),
  
  status: text('status').default('completed'), // 'pending', 'completed', 'failed'
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('user_id_idx').on(table.userId),
  }
})

// Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  applicationId: uuid('application_id').references(() => applications.id),
  
  reviewerId: uuid('reviewer_id').references(() => users.id).notNull(),
  revieweeId: uuid('reviewee_id').references(() => users.id).notNull(),
  
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment'),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  plan: text('plan').notNull(), // 'bar_basic', 'bar_pro', 'bar_business', 'influencer_premium'
  status: text('status').default('active'), // 'active', 'cancelled', 'expired'
  
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }).notNull(),
  
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
})

// Seat Keepers table (คนที่สมัครเป็น Seat Keeper)
export const seatKeepers = pgTable('seat_keepers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  isActive: boolean('is_active').default(true),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0'),
  totalBookings: integer('total_bookings').default(0),
  
  // Availability
  availableZones: jsonb('available_zones').$type<string[]>(), // ['ทองหล่อ', 'RCA']
  availableTimes: jsonb('available_times').$type<{
    day: string // 'monday', 'tuesday', etc.
    slots: string[] // ['18:00-22:00', '22:00-02:00']
  }[]>(),
  
  // Earnings
  totalEarnings: decimal('total_earnings', { precision: 10, scale: 2 }).default('0'),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).default('150'), // ค่าบริการต่อชั่วโมง
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
})

// Seat Bookings table (การจองโต๊ะ)
export const seatBookings = pgTable('seat_bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerId: uuid('customer_id').references(() => users.id).notNull(),
  seatKeeperId: uuid('seat_keeper_id').references(() => seatKeepers.id),
  
  // Venue Info
  venueName: text('venue_name').notNull(),
  venueZone: text('venue_zone').notNull(),
  venueAddress: text('venue_address'),
  
  // Timing
  keeperStartTime: timestamp('keeper_start_time', { mode: 'date' }).notNull(), // เวลาที่ Keeper ไปนั่ง
  customerArrivalTime: timestamp('customer_arrival_time', { mode: 'date' }).notNull(), // เวลาที่ลูกค้ามา
  actualArrivalTime: timestamp('actual_arrival_time', { mode: 'date' }), // เวลาที่ลูกค้ามาจริง
  
  // Details
  numberOfSeats: integer('number_of_seats').default(2),
  specialRequests: text('special_requests'),
  
  // Pricing
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  totalHours: decimal('total_hours', { precision: 4, scale: 2 }).notNull(),
  keeperFee: decimal('keeper_fee', { precision: 10, scale: 2 }).notNull(), // เงินที่ Keeper ได้
  platformFee: decimal('platform_fee', { precision: 10, scale: 2 }).notNull(), // ค่าธรรมเนียม Platform
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(), // รวมทั้งหมดที่ลูกค้าจ่าย
  
  // Status
  status: text('status').notNull().default('pending'), 
  // 'pending', 'confirmed', 'keeper_arrived', 'customer_arrived', 'completed', 'cancelled'
  
  // Check-in/out
  keeperCheckInTime: timestamp('keeper_check_in_time', { mode: 'date' }),
  keeperCheckInProof: text('keeper_check_in_proof'), // URL รูปถ่าย
  keeperCheckOutTime: timestamp('keeper_check_out_time', { mode: 'date' }),
  
  // Payment
  paymentStatus: text('payment_status').default('unpaid'), // 'unpaid', 'paid', 'refunded'
  paidAt: timestamp('paid_at', { mode: 'date' }),
  
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => {
  return {
    customerIdIdx: index('customer_id_idx').on(table.customerId),
    seatKeeperIdIdx: index('seat_keeper_id_idx').on(table.seatKeeperId),
    statusIdx: index('status_idx').on(table.status),
  }
})

// Export types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Job = typeof jobs.$inferSelect
export type NewJob = typeof jobs.$inferInsert
export type Application = typeof applications.$inferSelect
export type NewApplication = typeof applications.$inferInsert
export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert
export type TeamMember = typeof teamMembers.$inferSelect
export type Transaction = typeof transactions.$inferSelect
export type Review = typeof reviews.$inferSelect
export type Subscription = typeof subscriptions.$inferSelect
export type SeatKeeper = typeof seatKeepers.$inferSelect
export type NewSeatKeeper = typeof seatKeepers.$inferInsert
export type SeatBooking = typeof seatBookings.$inferSelect
export type NewSeatBooking = typeof seatBookings.$inferInsert

