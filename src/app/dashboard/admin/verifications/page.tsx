'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminVerificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    if (session?.user) {
      fetchPendingVerifications()
    }
  }, [session, status, router])

  const fetchPendingVerifications = async () => {
    try {
      const response = await fetch('/api/applications?verificationStatus=manual_review')
      const data = await response.json()
      
      setApplications(data.applications || [])
    } catch (error) {
      console.error('Error fetching verifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (applicationId: string) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action: 'approve',
        }),
      })

      if (!response.ok) throw new Error('Failed to approve')

      toast({
        title: 'อนุมัติสำเร็จ',
        description: 'ได้รับการอนุมัติและจ่ายเงินแล้ว',
      })

      fetchPendingVerifications()
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          action: 'reject',
        }),
      })

      if (!response.ok) throw new Error('Failed to reject')

      toast({
        title: 'ปฏิเสธแล้ว',
        description: 'ได้ทำการปฏิเสธแล้ว',
      })

      fetchPendingVerifications()
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12">
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
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 neon-text">ตรวจสอบงาน</h1>
          <p className="text-muted">งานที่รอการตรวจสอบด้วยตนเอง</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="text-yellow-500" size={20} />
              <span className="text-sm text-muted">รอตรวจสอบ</span>
            </div>
            <div className="text-3xl font-bold text-yellow-500">
              {applications.filter(a => a.verificationStatus === 'manual_review').length}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm text-muted">AI ผ่านอัตโนมัติ</span>
            </div>
            <div className="text-3xl font-bold text-green-500">
              {applications.filter(a => a.verificationStatus === 'auto_pass').length}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="text-red-500" size={20} />
              <span className="text-sm text-muted">ไม่ผ่าน</span>
            </div>
            <div className="text-3xl font-bold text-red-500">
              {applications.filter(a => a.verificationStatus === 'rejected').length}
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.filter(a => a.verificationStatus === 'manual_review').map((app) => (
            <div key={app.id} className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">งาน #{app.jobId?.slice(0, 8)}</h3>
                  <p className="text-sm text-muted">
                    Influencer: {app.influencerId?.slice(0, 8)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    app.verificationStatus === 'manual_review'
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {app.verificationStatus === 'manual_review' ? 'รอตรวจ' : app.verificationStatus}
                  </span>
                </div>
              </div>

              {/* AI Score */}
              {app.aiScore && (
                <div className="mb-4 p-4 bg-card rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted">AI Score</span>
                    <span className="font-bold">{parseFloat(app.aiScore)}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        parseFloat(app.aiScore) >= 85 ? 'bg-green-500' :
                        parseFloat(app.aiScore) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${app.aiScore}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Proof Images */}
              {app.proofUrls && app.proofUrls.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-muted mb-2">หลักฐานที่อัปโหลด</div>
                  <div className="flex gap-2">
                    {app.proofUrls.map((url: string, idx: number) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-24 h-24 bg-card rounded-xl flex items-center justify-center hover:bg-primary/10 transition-colors"
                      >
                        <ImageIcon size={32} className="text-muted" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleApprove(app.id)}
                  className="flex-1"
                >
                  <CheckCircle size={16} className="mr-2" />
                  อนุมัติ
                </Button>
                <Button 
                  onClick={() => handleReject(app.id)}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  <XCircle size={16} className="mr-2" />
                  ปฏิเสธ
                </Button>
              </div>
            </div>
          ))}

          {applications.filter(a => a.verificationStatus === 'manual_review').length === 0 && (
            <div className="glass rounded-2xl p-12 text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-green-500 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">ไม่มีงานรอตรวจสอบ</h3>
              <p className="text-muted">ทุกงานได้รับการตรวจสอบแล้ว</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

