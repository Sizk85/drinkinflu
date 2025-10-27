'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Users, Plus, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function TeamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [myTeam, setMyTeam] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user) {
      fetchTeamData()
    }
  }, [session, status, router])

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/teams')
      const data = await response.json()
      
      if (data.teams && data.teams.length > 0) {
        const team = data.teams[0]
        setMyTeam(team)
        
        // Fetch team members
        const membersRes = await fetch(`/api/teams/${team.id}/members`)
        const membersData = await membersRes.json()
        setMembers(membersData.members || [])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">ทีม / โม</h1>
          <p className="text-muted">จัดการทีมของคุณและแบ่งส่วนแบ่งอัตโนมัติ</p>
        </div>

        {/* Team Overview */}
        {myTeam ? (
          <>
            <div className="glass rounded-2xl p-8 mb-8 glow-primary">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{myTeam.name}</h2>
                  <p className="text-muted">{myTeam.members} สมาชิก</p>
                </div>
                <Button>
                  <Plus size={16} className="mr-2" />
                  เชิญสมาชิก
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-primary" size={20} />
                    <span className="text-sm text-muted">สมาชิก</span>
                  </div>
                  <div className="text-2xl font-bold">{myTeam.members}</div>
                </div>

                <div className="bg-card/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-accent" size={20} />
                    <span className="text-sm text-muted">รายได้รวม</span>
                  </div>
                  <div className="text-2xl font-bold text-accent">
                    ฿{myTeam.totalEarnings.toLocaleString()}
                  </div>
                </div>

                <div className="bg-card/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-primary" size={20} />
                    <span className="text-sm text-muted">คอมมิชชันของฉัน (15%)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ฿{myTeam.myCommission.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Members */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">สมาชิกในทีม</h2>
                <Button variant="outline" size="sm">จัดการ</Button>
              </div>

              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                        ★
                      </div>
                      <div>
                        <div className="font-bold">{member.name}</div>
                        <div className="text-sm text-muted">{member.jobs} งาน</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        ฿{member.earnings.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted">รายได้</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <Users size={64} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">ยังไม่มีทีม</h2>
            <p className="text-muted mb-6">
              สร้างทีมของคุณและเริ่มจัดการลูกทีมได้เลย
            </p>
            <Button>
              <Plus size={16} className="mr-2" />
              สร้างทีมใหม่
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

