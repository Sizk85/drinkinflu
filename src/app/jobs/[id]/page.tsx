import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { db } from '@/db'
import { jobs, users, applications } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/pricing'
import { formatDateTime } from '@/lib/date-utils'
import { MapPin, Calendar, Users as UsersIcon, DollarSign, Wine, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // Fetch job with bar details
  const [jobData] = await db
    .select({
      job: jobs,
      bar: users,
    })
    .from(jobs)
    .leftJoin(users, eq(jobs.barId, users.id))
    .where(eq(jobs.id, params.id))
    .limit(1)

  if (!jobData) {
    notFound()
  }

  const { job, bar } = jobData

  // Fetch applications count
  const applicationsCount = await db
    .select()
    .from(applications)
    .where(eq(applications.jobId, job.id))

  const showCash = job.cashAmount && parseFloat(job.cashAmount) > 0
  const showDrinks = job.drinksValue && parseFloat(job.drinksValue) > 0

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link href="/explore" className="text-primary hover:underline mb-6 inline-block">
          ← กลับไปหน้าค้นหางาน
        </Link>

        {/* Job Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Bar Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center text-6xl">
                {bar?.barLogo ? (
                  <Image src={bar.barLogo} alt={bar.barName || ''} width={128} height={128} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  '🍸'
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 neon-text">
                {job.title}
              </h1>
              
              <Link href={`/profiles/${bar?.handle}`} className="text-accent hover:underline text-lg mb-4 inline-block">
                {bar?.barName}
              </Link>

              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary" />
                  <span>{bar?.barZone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} className="text-accent" />
                  <span>{formatDateTime(job.date)}</span>
                  {job.timeSlot && <span>• {job.timeSlot}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <UsersIcon size={16} className="text-green-500" />
                  <span>ต้องการ {job.requiredCount} คน</span>
                  {(job.acceptedCount ?? 0) > 0 && (
                    <span className="text-green-500">
                      (รับแล้ว {job.acceptedCount})
                    </span>
                  )}
                </div>
              </div>

              {/* Compensation */}
              <div className="flex items-center gap-6 mb-6">
                {showCash && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} className="text-green-500" />
                    <span className="text-2xl font-bold text-green-500">
                      {formatCurrency(job.cashAmount!)}
                    </span>
                  </div>
                )}
                {showDrinks && (
                  <div className="flex items-center gap-2">
                    <Wine size={24} className="text-accent" />
                    <span className="text-2xl font-bold text-accent">
                      {formatCurrency(job.drinksValue!)}
                    </span>
                  </div>
                )}
              </div>

              {job.status === 'open' ? (
                <Button size="lg" className="w-full md:w-auto px-12">
                  รับงานนี้
                </Button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-muted/20 text-muted inline-block">
                  {job.status === 'in_progress' && 'กำลังดำเนินการ'}
                  {job.status === 'completed' && 'งานสำเร็จแล้ว'}
                  {job.status === 'cancelled' && 'ยกเลิกแล้ว'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">รายละเอียด</h2>
            <p className="text-muted whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">เงื่อนไขการโพสต์</h2>
            
            <div className="space-y-3">
              {(job.requirements as any).storyCount > 0 && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span>โพสต์สตอรี่ {(job.requirements as any).storyCount} รูป</span>
                </div>
              )}
              {(job.requirements as any).mustTagBar && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span>ต้องแท็กร้าน @{bar?.handle}</span>
                </div>
              )}
              {(job.requirements as any).mustEnableLocation && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span>เปิด Location Tag</span>
                </div>
              )}
              {(job.requirements as any).mustShowDrink && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span>แสดงภาพเครื่องดื่ม</span>
                </div>
              )}
              {job.minFollowers && (
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-primary" size={20} />
                  <span>Followers ขั้นต่ำ {job.minFollowers.toLocaleString()} คน</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bar Info */}
        {bar && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">เกี่ยวกับร้าน</h2>
            
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <div className="mb-2">
                  <strong>ที่อยู่:</strong> {bar.barLocation || 'ไม่ระบุ'}
                </div>
                {bar.barMusicStyle && (
                  <div className="mb-2">
                    <strong>สไตล์เพลง:</strong> {bar.barMusicStyle}
                  </div>
                )}
                {bar.bio && (
                  <div className="text-muted mt-4">{bar.bio}</div>
                )}
              </div>
              
              <Link href={`/profiles/${bar.handle}`}>
                <Button variant="outline">ดูโปรไฟล์ร้าน</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

