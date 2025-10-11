import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Users, Plus, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function TeamsPage() {
  // TODO: Fetch real teams from API
  const myTeam = {
    id: '1',
    name: "Bella's Squad",
    members: 3,
    totalEarnings: 45200,
    myCommission: 6780,
  }

  const members = [
    { id: '1', name: 'Max Party', jobs: 12, earnings: 18400 },
    { id: '2', name: 'Jay Vibes', jobs: 8, earnings: 12500 },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">ทีม / โม</h1>
          <p className="text-muted">จัดการทีมของคุณและแบ่งส่วนแบ่งอัตโนมัติ 👥</p>
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
                        ⭐
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

