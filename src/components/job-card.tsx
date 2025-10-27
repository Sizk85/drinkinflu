import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Job, User } from '@/db/schema'
import { formatCurrency } from '@/lib/pricing'
import { formatJobDate } from '@/lib/date-utils'
import { MapPin, Calendar, Users, DollarSign, Wine } from 'lucide-react'

interface JobCardProps {
  job: Job
  bar: User | null
}

export function JobCard({ job, bar }: JobCardProps) {
  const showCash = job.cashAmount && parseFloat(job.cashAmount) > 0
  const showDrinks = job.drinksValue && parseFloat(job.drinksValue) > 0

  return (
    <div className="glass rounded-2xl p-6 hover:glow-primary transition-all">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Bar Logo/Avatar */}
        <div className="flex-shrink-0">
          {bar?.barLogo ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden">
              <Image src={bar.barLogo} alt={bar.barName || ''} width={80} height={80} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
              <Wine size={32} className="text-accent" />
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold mb-1">{job.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted">
                <span className="font-medium text-accent">{bar?.barName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {bar?.barZone}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-muted mb-4 line-clamp-2">{job.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted">
              <Calendar size={16} className="text-primary" />
              <span>{formatJobDate(job.date)}</span>
              {job.timeSlot && <span>• {job.timeSlot}</span>}
            </div>
            <div className="flex items-center gap-1.5 text-muted">
              <Users size={16} className="text-accent" />
              <span>ต้องการ {job.requiredCount} คน</span>
              {(job.acceptedCount ?? 0) > 0 && (
                <span className="text-green-500">
                  (รับแล้ว {job.acceptedCount})
                </span>
              )}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(job.requirements as any).storyCount > 0 && (
                <span className="text-xs px-2 py-1 rounded-lg bg-primary/20 text-primary">
                  สตอรี่ {(job.requirements as any).storyCount} รูป
                </span>
              )}
              {(job.requirements as any).mustTagBar && (
                <span className="text-xs px-2 py-1 rounded-lg bg-accent/20 text-accent">
                  แท็กร้าน
                </span>
              )}
              {(job.requirements as any).mustEnableLocation && (
                <span className="text-xs px-2 py-1 rounded-lg bg-accent/20 text-accent">
                  เปิด Location
                </span>
              )}
              {job.minFollowers && (
                <span className="text-xs px-2 py-1 rounded-lg bg-muted/20 text-muted">
                  Min {job.minFollowers.toLocaleString()} followers
                </span>
              )}
              {job.viaTeam && (
                <span className="text-xs px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400">
                  ผ่านโม
                </span>
              )}
            </div>
          )}

          {/* Compensation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showCash && (
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-500" />
                  <span className="text-lg font-bold text-green-500">
                    {formatCurrency(job.cashAmount!)}
                  </span>
                </div>
              )}
              {showDrinks && (
                <div className="flex items-center gap-2">
                  <Wine size={20} className="text-accent" />
                  <span className="text-lg font-bold text-accent">
                    {formatCurrency(job.drinksValue!)}
                  </span>
                </div>
              )}
            </div>

            <Link href={`/jobs/${job.id}`}>
              <Button>รับงาน</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

