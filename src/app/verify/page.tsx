'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Upload, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function VerifyPage() {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [proofUrls, setProofUrls] = useState<string[]>([])
  const [applicationId, setApplicationId] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // TODO: Upload to R2
      // Mock: สร้าง URLs ปลอม
      const mockUrls = Array.from(files).map((file, i) => 
        `https://mock.r2.dev/proof-${Date.now()}-${i}.jpg`
      )
      
      setProofUrls([...proofUrls, ...mockUrls])

      toast({
        title: 'อัปโหลดสำเร็จ!',
        description: `อัปโหลด ${files.length} ไฟล์`,
      })
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปโหลดไฟล์ได้',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmitVerification = async () => {
    if (proofUrls.length === 0) {
      toast({
        title: 'กรุณาอัปโหลดรูป',
        description: 'ต้องมีรูปภาพอย่างน้อย 1 รูป',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: applicationId || 'temp-app-id',
          proofUrls,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      toast({
        title: data.status === 'auto_pass' ? '✅ ผ่านการตรวจสอบ!' : '⏳ รอการตรวจสอบ',
        description: data.message,
      })

      // Clear form
      setProofUrls([])
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">ส่งหลักฐานโพสต์</h1>
          <p className="text-muted">อัปโหลดสกรีนสตอรี่ Instagram เพื่อตรวจสอบ 📸</p>
        </div>

        {/* Instructions */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">วิธีการส่งหลักฐาน</h2>
          <ol className="space-y-3 text-sm text-muted list-decimal list-inside">
            <li>โพสต์สตอรี่ Instagram ตามเงื่อนไขของงาน</li>
            <li>สกรีนช็อตสตอรี่ที่โพสต์ (ต้องเห็นชื่อร้าน, location, แท็ก)</li>
            <li>อัปโหลดรูปทั้งหมดที่นี่</li>
            <li>กดส่ง - ระบบ AI จะตรวจสอบอัตโนมัติ</li>
          </ol>
        </div>

        {/* Upload Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">อัปโหลดรูปภาพ</h2>

          <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center mb-6">
            <Upload size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-muted mb-4">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวางที่นี่</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button type="button" asChild>
                <span className="cursor-pointer">
                  เลือกไฟล์
                </span>
              </Button>
            </label>
          </div>

          {/* Preview uploaded files */}
          {proofUrls.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3">รูปที่อัปโหลด ({proofUrls.length})</div>
              <div className="grid grid-cols-3 gap-4">
                {proofUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl bg-card border border-border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="text-green-500" size={32} />
                    </div>
                    <div className="absolute bottom-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                      รูป {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setProofUrls([])}
            disabled={proofUrls.length === 0}
          >
            ล้างทั้งหมด
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSubmitVerification}
            disabled={isUploading || proofUrls.length === 0}
          >
            {isUploading ? 'กำลังส่ง...' : 'ส่งหลักฐาน'}
          </Button>
        </div>

        {/* Status Examples */}
        <div className="mt-12 glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">สถานะการตรวจสอบ</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl">
              <CheckCircle className="text-green-500" size={20} />
              <div>
                <div className="font-medium">ผ่าน (AI อัตโนมัติ)</div>
                <div className="text-xs text-muted">AI Score ≥ 85%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-xl">
              <Clock className="text-yellow-500" size={20} />
              <div>
                <div className="font-medium">รอตรวจสอบด้วยตนเอง</div>
                <div className="text-xs text-muted">AI Score 70-84%</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl">
              <XCircle className="text-red-500" size={20} />
              <div>
                <div className="font-medium">ไม่ผ่าน</div>
                <div className="text-xs text-muted">AI Score &lt; 70%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

