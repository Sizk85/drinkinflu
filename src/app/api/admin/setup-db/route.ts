import { NextRequest, NextResponse } from 'next/server'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'

// API endpoint สำหรับ setup database แบบเต็มรูปแบบ
export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    
    const MIGRATION_SECRET = process.env.MIGRATION_SECRET || 'drinkinflu-migration-secret'
    
    if (secret !== MIGRATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Setting up database...')

    const sql = postgres(process.env.DATABASE_URL!, { max: 1 })

    // Drop all tables (if exists) - เพื่อเริ่มใหม่
    await sql`DROP TABLE IF EXISTS event_bookings CASCADE`
    await sql`DROP TABLE IF EXISTS events CASCADE`
    await sql`DROP TABLE IF EXISTS venue_analytics CASCADE`
    await sql`DROP TABLE IF EXISTS partner_venues CASCADE`
    await sql`DROP TABLE IF EXISTS keeper_verifications CASCADE`
    await sql`DROP TABLE IF EXISTS tips CASCADE`
    await sql`DROP TABLE IF EXISTS chat_messages CASCADE`
    await sql`DROP TABLE IF EXISTS seat_bookings CASCADE`
    await sql`DROP TABLE IF EXISTS seat_keepers CASCADE`
    await sql`DROP TABLE IF EXISTS reviews CASCADE`
    await sql`DROP TABLE IF EXISTS subscriptions CASCADE`
    await sql`DROP TABLE IF EXISTS transactions CASCADE`
    await sql`DROP TABLE IF EXISTS applications CASCADE`
    await sql`DROP TABLE IF EXISTS jobs CASCADE`
    await sql`DROP TABLE IF EXISTS team_members CASCADE`
    await sql`DROP TABLE IF EXISTS teams CASCADE`
    await sql`DROP TABLE IF EXISTS users CASCADE`

    console.log('Dropped old tables...')

    // สร้าง users table
    await sql`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL UNIQUE,
        password_hash text,
        name text NOT NULL,
        role text NOT NULL,
        handle text UNIQUE,
        avatar_url text,
        bio text,
        phone text,
        ig_username text,
        ig_followers integer,
        ig_reach_avg integer,
        city text,
        zones jsonb,
        rating numeric(3, 2) DEFAULT 0,
        total_jobs integer DEFAULT 0,
        is_premium boolean DEFAULT false,
        bar_name text,
        bar_logo text,
        bar_location text,
        bar_zone text,
        bar_music_style text,
        bar_images jsonb,
        wallet_balance numeric(10, 2) DEFAULT 0,
        email_verified timestamp,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง jobs table
    await sql`
      CREATE TABLE jobs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        bar_id uuid NOT NULL REFERENCES users(id),
        title text NOT NULL,
        description text,
        date timestamp NOT NULL,
        time_slot text,
        required_count integer DEFAULT 1,
        requirements jsonb,
        compensation_type text NOT NULL,
        cash_amount numeric(10, 2),
        drinks_value numeric(10, 2),
        total_value numeric(10, 2) NOT NULL,
        preferred_gender text,
        min_followers integer,
        via_team boolean DEFAULT false,
        status text DEFAULT 'open' NOT NULL,
        accepted_count integer DEFAULT 0,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง teams table
    await sql`
      CREATE TABLE teams (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id uuid NOT NULL REFERENCES users(id),
        name text NOT NULL,
        description text,
        commission_rate numeric(3, 2) DEFAULT 0.15,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง team_members table  
    await sql`
      CREATE TABLE team_members (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        team_id uuid NOT NULL REFERENCES teams(id),
        influencer_id uuid NOT NULL REFERENCES users(id),
        share_percentage numeric(3, 2) DEFAULT 1.00,
        status text DEFAULT 'active',
        joined_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง applications table
    await sql`
      CREATE TABLE applications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id uuid NOT NULL REFERENCES jobs(id),
        influencer_id uuid NOT NULL REFERENCES users(id),
        team_id uuid REFERENCES teams(id),
        status text DEFAULT 'pending' NOT NULL,
        proof_urls jsonb,
        verification_status text,
        ai_score numeric(3, 2),
        verification_details jsonb,
        verified_at timestamp,
        payment_status text DEFAULT 'unpaid',
        payment_amount numeric(10, 2),
        platform_fee numeric(10, 2),
        paid_at timestamp,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง transactions table
    await sql`
      CREATE TABLE transactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        type text NOT NULL,
        amount numeric(10, 2) NOT NULL,
        balance_before numeric(10, 2) NOT NULL,
        balance_after numeric(10, 2) NOT NULL,
        related_job_id uuid REFERENCES jobs(id),
        related_application_id uuid REFERENCES applications(id),
        description text,
        metadata jsonb,
        status text DEFAULT 'completed',
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง reviews table
    await sql`
      CREATE TABLE reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id uuid NOT NULL REFERENCES jobs(id),
        application_id uuid REFERENCES applications(id),
        reviewer_id uuid NOT NULL REFERENCES users(id),
        reviewee_id uuid NOT NULL REFERENCES users(id),
        rating integer NOT NULL,
        comment text,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง subscriptions table
    await sql`
      CREATE TABLE subscriptions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        plan text NOT NULL,
        status text DEFAULT 'active',
        start_date timestamp NOT NULL,
        end_date timestamp NOT NULL,
        amount numeric(10, 2) NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง seat_keepers table
    await sql`
      CREATE TABLE seat_keepers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id),
        is_active boolean DEFAULT true,
        rating numeric(3, 2) DEFAULT 0,
        total_bookings integer DEFAULT 0,
        total_reviews integer DEFAULT 0,
        is_verified boolean DEFAULT false,
        verification_status text DEFAULT 'unverified',
        verified_badges jsonb,
        available_zones jsonb,
        available_times jsonb,
        total_earnings numeric(10, 2) DEFAULT 0,
        hourly_rate numeric(10, 2) DEFAULT 150,
        total_tips_received numeric(10, 2) DEFAULT 0,
        completion_rate numeric(3, 2) DEFAULT 0,
        average_response_time integer,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง seat_bookings table
    await sql`
      CREATE TABLE seat_bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id uuid NOT NULL REFERENCES users(id),
        seat_keeper_id uuid REFERENCES seat_keepers(id),
        venue_name text NOT NULL,
        venue_zone text NOT NULL,
        venue_address text,
        keeper_start_time timestamp NOT NULL,
        customer_arrival_time timestamp NOT NULL,
        actual_arrival_time timestamp,
        number_of_seats integer DEFAULT 2,
        special_requests text,
        hourly_rate numeric(10, 2) NOT NULL,
        total_hours numeric(4, 2) NOT NULL,
        keeper_fee numeric(10, 2) NOT NULL,
        platform_fee numeric(10, 2) NOT NULL,
        total_amount numeric(10, 2) NOT NULL,
        status text DEFAULT 'pending' NOT NULL,
        keeper_check_in_time timestamp,
        keeper_check_in_proof text,
        keeper_check_out_time timestamp,
        payment_status text DEFAULT 'unpaid',
        paid_at timestamp,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง chat_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_id uuid NOT NULL REFERENCES seat_bookings(id),
        sender_id uuid NOT NULL REFERENCES users(id),
        receiver_id uuid NOT NULL REFERENCES users(id),
        message text NOT NULL,
        is_read boolean DEFAULT false,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง tips table
    await sql`
      CREATE TABLE IF NOT EXISTS tips (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_id uuid NOT NULL REFERENCES seat_bookings(id),
        from_user_id uuid NOT NULL REFERENCES users(id),
        to_user_id uuid NOT NULL REFERENCES users(id),
        amount numeric(10, 2) NOT NULL,
        message text,
        status text DEFAULT 'completed',
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง keeper_verifications table
    await sql`
      CREATE TABLE IF NOT EXISTS keeper_verifications (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        keeper_id uuid NOT NULL REFERENCES seat_keepers(id),
        verification_type text NOT NULL,
        status text DEFAULT 'pending',
        document_url text,
        id_card_number text,
        phone_number text,
        phone_verified boolean DEFAULT false,
        verified_by uuid REFERENCES users(id),
        verified_at timestamp,
        rejection_reason text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง partner_venues table
    await sql`
      CREATE TABLE IF NOT EXISTS partner_venues (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        owner_id uuid NOT NULL REFERENCES users(id),
        venue_name text NOT NULL,
        venue_type text NOT NULL,
        description text,
        zone text NOT NULL,
        city text NOT NULL,
        address text,
        latitude numeric(10, 8),
        longitude numeric(11, 8),
        phone text,
        email text,
        website text,
        logo_url text,
        images jsonb,
        music_style text,
        capacity integer,
        opening_hours jsonb,
        amenities jsonb,
        rating numeric(3, 2) DEFAULT 0,
        total_reviews integer DEFAULT 0,
        total_bookings integer DEFAULT 0,
        is_verified boolean DEFAULT false,
        is_active boolean DEFAULT true,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง events table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        venue_id uuid NOT NULL REFERENCES partner_venues(id),
        created_by uuid NOT NULL REFERENCES users(id),
        title text NOT NULL,
        description text,
        event_type text NOT NULL,
        start_time timestamp NOT NULL,
        end_time timestamp NOT NULL,
        poster_url text,
        images jsonb,
        has_promotion boolean DEFAULT false,
        promotion_details jsonb,
        discount_percentage integer,
        requires_booking boolean DEFAULT false,
        max_capacity integer,
        current_bookings integer DEFAULT 0,
        booking_fee numeric(10, 2),
        status text DEFAULT 'upcoming',
        is_published boolean DEFAULT true,
        is_featured boolean DEFAULT false,
        view_count integer DEFAULT 0,
        interested_count integer DEFAULT 0,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง event_bookings table  
    await sql`
      CREATE TABLE IF NOT EXISTS event_bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id uuid NOT NULL REFERENCES events(id),
        user_id uuid NOT NULL REFERENCES users(id),
        number_of_people integer DEFAULT 1,
        total_amount numeric(10, 2),
        status text DEFAULT 'confirmed',
        checked_in_at timestamp,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง venue_analytics table
    await sql`
      CREATE TABLE IF NOT EXISTS venue_analytics (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        venue_id uuid NOT NULL REFERENCES partner_venues(id),
        date timestamp NOT NULL,
        total_bookings integer DEFAULT 0,
        total_revenue numeric(10, 2) DEFAULT 0,
        total_views integer DEFAULT 0,
        unique_visitors integer DEFAULT 0,
        seat_keeper_bookings integer DEFAULT 0,
        average_wait_time numeric(5, 2),
        event_attendance integer DEFAULT 0,
        created_at timestamp DEFAULT now() NOT NULL
      )
    `

    // สร้าง indexes
    await sql`CREATE INDEX IF NOT EXISTS handle_idx ON users(handle)`
    await sql`CREATE INDEX IF NOT EXISTS email_idx ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS bar_id_idx ON jobs(bar_id)`
    await sql`CREATE INDEX IF NOT EXISTS date_idx ON jobs(date)`
    await sql`CREATE INDEX IF NOT EXISTS status_idx ON jobs(status)`
    await sql`CREATE INDEX IF NOT EXISTS job_id_idx ON applications(job_id)`
    await sql`CREATE INDEX IF NOT EXISTS influencer_id_idx ON applications(influencer_id)`
    await sql`CREATE INDEX IF NOT EXISTS user_id_idx ON transactions(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS booking_customer_id_idx ON seat_bookings(customer_id)`
    await sql`CREATE INDEX IF NOT EXISTS booking_seat_keeper_id_idx ON seat_bookings(seat_keeper_id)`
    await sql`CREATE INDEX IF NOT EXISTS booking_status_idx ON seat_bookings(status)`
    await sql`CREATE INDEX IF NOT EXISTS chat_booking_id_idx ON chat_messages(booking_id)`
    await sql`CREATE INDEX IF NOT EXISTS chat_sender_id_idx ON chat_messages(sender_id)`
    await sql`CREATE INDEX IF NOT EXISTS venue_owner_id_idx ON partner_venues(owner_id)`
    await sql`CREATE INDEX IF NOT EXISTS venue_zone_idx ON partner_venues(zone)`
    await sql`CREATE INDEX IF NOT EXISTS venue_is_active_idx ON partner_venues(is_active)`
    await sql`CREATE INDEX IF NOT EXISTS event_venue_id_idx ON events(venue_id)`
    await sql`CREATE INDEX IF NOT EXISTS event_start_time_idx ON events(start_time)`
    await sql`CREATE INDEX IF NOT EXISTS event_status_idx ON events(status)`
    await sql`CREATE INDEX IF NOT EXISTS analytics_venue_date_idx ON venue_analytics(venue_id, date)`

    console.log('Created all tables and indexes...')

    // Seed ข้อมูลพื้นฐาน
    const adminPassword = await bcrypt.hash('admin123', 10)
    await sql`
      INSERT INTO users (email, password_hash, name, role, handle, wallet_balance)
      VALUES ('admin@drinkinflu.com', ${adminPassword}, 'Admin', 'admin', 'admin', 0)
    `

    const barPassword = await bcrypt.hash('bar123', 10)
    await sql`
      INSERT INTO users (email, password_hash, name, role, handle, bar_name, bar_zone, bar_location, bar_music_style, wallet_balance)
      VALUES 
        ('route66@bar.com', ${barPassword}, 'Route 66', 'bar', 'route66', 'Route 66 Club', 'RCA', 'RCA Plaza, กรุงเทพฯ', 'EDM, Hip Hop', 50000),
        ('demon@bar.com', ${barPassword}, 'Demon Bar', 'bar', 'demonbar', 'Demon Bar', 'ทองหล่อ', 'ทองหล่อ 11, กรุงเทพฯ', 'Techno, House', 30000)
    `

    const influPassword = await bcrypt.hash('influ123', 10)
    await sql`
      INSERT INTO users (email, password_hash, name, role, handle, ig_username, ig_followers, ig_reach_avg, city, zones, rating, total_jobs, is_premium, wallet_balance, bio)
      VALUES 
        ('bella@influ.com', ${influPassword}, 'Bella Night', 'influencer', 'bellanight', '@bellanight', 12500, 8000, 'กรุงเทพฯ', '["ทองหล่อ", "RCA", "เอกมัย"]'::jsonb, 4.8, 45, true, 15000, 'Bangkok nightlife enthusiast'),
        ('max@influ.com', ${influPassword}, 'Max Party', 'influencer', 'maxparty', '@maxparty', 8500, 5000, 'กรุงเทพฯ', '["RCA", "สุขุมวิท"]'::jsonb, 4.5, 28, false, 8500, 'Party lover and content creator')
    `

    console.log('Seeded basic data...')

    await sql.end()

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully!',
      created: {
        tables: 17,
        users: 5,
      }
    })
  } catch (error: any) {
    console.error('Setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Setup failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

