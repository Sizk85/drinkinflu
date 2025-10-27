import { Navbar } from '@/components/navbar'
import { JobCard } from '@/components/job-card'
import { FiltersPanel } from '@/components/filters-panel'
import { db } from '@/db'
import { jobs, users } from '@/db/schema'
import { eq, and, gte } from 'drizzle-orm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ExplorePage() {
  // Fetch open jobs with bar details
  const openJobs = await db
    .select({
      job: jobs,
      bar: users,
    })
    .from(jobs)
    .leftJoin(users, eq(jobs.barId, users.id))
    .where(and(
      eq(jobs.status, 'open'),
      gte(jobs.date, new Date())
    ))
    .orderBy(jobs.date)

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            ค้นหางาน
          </h1>
          <p className="text-xl text-muted">
            เลือกงานที่เหมาะกับคุณ รับเงิน รับโปร ง่ายๆ
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersPanel />
          </div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3">
            {openJobs.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <h3 className="text-2xl font-bold mb-2">ไม่พบงาน</h3>
                <p className="text-muted">ลองเปลี่ยนฟิลเตอร์หรือกลับมาใหม่ภายหลัง</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-sm text-muted">
                  พบ {openJobs.length} งาน
                </div>
                <div className="grid gap-6">
                  {openJobs.map(({ job, bar }) => (
                    <JobCard key={job.id} job={job} bar={bar ?? null} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

