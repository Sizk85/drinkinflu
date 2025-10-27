import { NextRequest, NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

// API endpoint สำหรับรัน migrations (Admin only)
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

    console.log('Running migrations...')

    const connection = postgres(process.env.DATABASE_URL!, { max: 1 })
    const db = drizzle(connection)

    await migrate(db, { migrationsFolder: './drizzle' })

    await connection.end()

    console.log('Migrations completed successfully')

    return NextResponse.json({
      success: true,
      message: 'Migrations completed successfully',
    })
  } catch (error: any) {
    console.error('Migration failed:', error)
    return NextResponse.json(
      { 
        error: 'Migration failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET - ดูสถานะ migrations
export async function GET() {
  return NextResponse.json({
    message: 'Migration API endpoint',
    usage: 'POST with { "secret": "your-secret" } to run migrations',
  })
}

