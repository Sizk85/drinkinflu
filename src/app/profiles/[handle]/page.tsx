import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { MapPin, Instagram, Star, Briefcase } from 'lucide-react'
import Image from 'next/image'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  // Fetch user by handle
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.handle, params.handle))
    .limit(1)

  if (!user) {
    notFound()
  }

  const isInfluencer = user.role === 'influencer'
  const isBar = user.role === 'bar'

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center text-6xl">
                {user.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={user.name} width={128} height={128} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  isBar ? '🍸' : '⭐'
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 neon-text">
                    {isBar ? user.barName : user.name}
                    {user.isPremium && (
                      <span className="text-accent ml-2">✓</span>
                    )}
                  </h1>
                  <div className="text-muted mb-2">@{user.handle}</div>
                </div>
                <Button>ส่งข้อความ</Button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-4">
                {isInfluencer && (
                  <>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {user.igFollowers?.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted">Followers</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {user.totalJobs}
                      </div>
                      <div className="text-sm text-muted">งานที่ทำ</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                        {user.rating} <Star size={20} />
                      </div>
                      <div className="text-sm text-muted">เรตติ้ง</div>
                    </div>
                  </>
                )}
                {isBar && (
                  <div>
                    <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                      {user.rating || '5.0'} <Star size={20} />
                    </div>
                    <div className="text-sm text-muted">เรตติ้ง</div>
                  </div>
                )}
              </div>

              {/* Location & Zone */}
              <div className="flex flex-wrap gap-4 mb-4">
                {isInfluencer && user.city && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-accent" />
                    <span>{user.city}</span>
                  </div>
                )}
                {isBar && user.barLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-accent" />
                    <span>{user.barLocation}</span>
                  </div>
                )}
                {isInfluencer && user.igUsername && (
                  <div className="flex items-center gap-2 text-sm">
                    <Instagram size={16} className="text-primary" />
                    <span>@{user.igUsername}</span>
                  </div>
                )}
              </div>

              {/* Zones */}
              {isInfluencer && user.zones && (user.zones as string[]).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(user.zones as string[]).map((zone) => (
                    <span key={zone} className="text-xs px-3 py-1 rounded-lg bg-primary/20 text-primary">
                      {zone}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio */}
              {user.bio && (
                <p className="text-muted">{user.bio}</p>
              )}

              {/* Bar specific info */}
              {isBar && user.barMusicStyle && (
                <div className="mt-4">
                  <div className="text-sm text-muted mb-2">สไตล์เพลง:</div>
                  <div className="text-accent">{user.barMusicStyle}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs / Content */}
        {isInfluencer && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">ผลงาน</h2>
            <div className="text-center py-12 text-muted">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p>ยังไม่มีผลงานที่แสดง</p>
            </div>
          </div>
        )}

        {isBar && (
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">งานที่เปิดรับ</h2>
            <div className="text-center py-12 text-muted">
              <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
              <p>ไม่มีงานที่เปิดรับในขณะนี้</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

