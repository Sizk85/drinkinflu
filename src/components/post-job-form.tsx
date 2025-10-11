'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CITIES, COMPENSATION_TYPES } from '@/lib/constants'
import { estimateJobValue, formatCurrency } from '@/lib/pricing'
import { useToast } from '@/components/ui/use-toast'

export function PostJobForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('20:00-02:00')
  const [requiredCount, setRequiredCount] = useState(1)
  const [storyCount, setStoryCount] = useState(3)
  const [mustTagBar, setMustTagBar] = useState(true)
  const [mustEnableLocation, setMustEnableLocation] = useState(true)
  const [mustShowDrink, setMustShowDrink] = useState(true)
  const [compensationType, setCompensationType] = useState<'cash' | 'drinks' | 'both'>('both')
  const [cashAmount, setCashAmount] = useState(800)
  const [drinksValue, setDrinksValue] = useState(500)
  const [minFollowers, setMinFollowers] = useState(3000)
  const [viaTeam, setViaTeam] = useState(false)

  // Calculate estimate
  const estimate = estimateJobValue(
    compensationType === 'drinks' ? 0 : cashAmount,
    compensationType === 'cash' ? 0 : drinksValue,
    requiredCount
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Submit to API
      toast({
        title: 'สำเร็จ!',
        description: 'โพสต์งานเรียบร้อยแล้ว',
      })
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโพสต์งานได้ กรุณาลองใหม่อีกครั้ง',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">ข้อมูลพื้นฐาน</h2>

        <div>
          <label className="block text-sm font-medium mb-2">ชื่องาน *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="เช่น: Friday Night Party @ Route 66"
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">รายละเอียด</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="บรรยายงานของคุณ บรรยากาศ ประเภทเพลง..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">วันที่ *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">เวลา</label>
            <input
              type="text"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              placeholder="20:00-02:00"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">จำนวนที่ต้องการ *</label>
          <input
            type="number"
            min="1"
            value={requiredCount}
            onChange={(e) => setRequiredCount(parseInt(e.target.value) || 1)}
            required
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          />
        </div>
      </div>

      {/* Requirements */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">เงื่อนไขการโพสต์</h2>

        <div>
          <label className="block text-sm font-medium mb-2">จำนวนสตอรี่</label>
          <input
            type="number"
            min="1"
            value={storyCount}
            onChange={(e) => setStoryCount(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mustTagBar}
              onChange={(e) => setMustTagBar(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span>ต้องแท็กร้าน</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mustEnableLocation}
              onChange={(e) => setMustEnableLocation(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span>ต้องเปิด Location</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mustShowDrink}
              onChange={(e) => setMustShowDrink(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span>ต้องมีภาพเครื่องดื่ม</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Followers ขั้นต่ำ</label>
          <input
            type="number"
            min="0"
            step="100"
            value={minFollowers}
            onChange={(e) => setMinFollowers(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          />
        </div>
      </div>

      {/* Compensation */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">ค่าตอบแทน</h2>

        <div>
          <label className="block text-sm font-medium mb-2">ประเภท *</label>
          <select
            value={compensationType}
            onChange={(e) => setCompensationType(e.target.value as any)}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-white"
          >
            {COMPENSATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {compensationType !== 'drinks' && (
          <div>
            <label className="block text-sm font-medium mb-2">เงินสด (ต่อคน)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted">฿</span>
              <input
                type="number"
                min="0"
                step="50"
                value={cashAmount}
                onChange={(e) => setCashAmount(parseInt(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>
          </div>
        )}

        {compensationType !== 'cash' && (
          <div>
            <label className="block text-sm font-medium mb-2">มูลค่าเครื่องดื่ม (ต่อคน)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-muted">฿</span>
              <input
                type="number"
                min="0"
                step="50"
                value={drinksValue}
                onChange={(e) => setDrinksValue(parseInt(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-card border border-border text-white"
              />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-border space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted">ค่าตอบแทนอินฟลู:</span>
            <span className="font-medium">{formatCurrency(estimate.cashAmount)}</span>
          </div>
          {estimate.drinksValue > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted">มูลค่าเครื่องดื่ม:</span>
              <span className="font-medium">{formatCurrency(estimate.drinksValue)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted">ค่าธรรมเนียมแพลตฟอร์ม (15%):</span>
            <span className="font-medium text-accent">{formatCurrency(estimate.platformFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
            <span>รวมทั้งหมด:</span>
            <span className="text-primary">{formatCurrency(estimate.barTotal)}</span>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">ตัวเลือกเพิ่มเติม</h2>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={viaTeam}
            onChange={(e) => setViaTeam(e.target.checked)}
            className="w-5 h-5 rounded accent-primary"
          />
          <div>
            <div className="font-medium">เปิดให้จองผ่านโม/ทีม</div>
            <div className="text-sm text-muted">โมสามารถจองงานนี้ให้ทีมของตัวเองได้</div>
          </div>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => window.history.back()}
        >
          ยกเลิก
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'กำลังโพสต์...' : 'โพสต์งาน'}
        </Button>
      </div>
    </form>
  )
}

