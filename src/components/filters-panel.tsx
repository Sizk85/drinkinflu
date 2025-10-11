'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CITIES, ZONES, COMPENSATION_TYPES } from '@/lib/constants'

export function FiltersPanel() {
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [selectedComp, setSelectedComp] = useState<string>('')
  const [minCash, setMinCash] = useState<string>('')
  const [viaTeam, setViaTeam] = useState<string>('')

  const handleReset = () => {
    setSelectedCity('')
    setSelectedZone('')
    setSelectedComp('')
    setMinCash('')
    setViaTeam('')
  }

  return (
    <div className="glass rounded-2xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">ฟิลเตอร์</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          รีเซ็ต
        </Button>
      </div>

      <div className="space-y-6">
        {/* City */}
        <div>
          <label className="block text-sm font-medium mb-2">เมือง</label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value)
              setSelectedZone('')
            }}
            className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white"
          >
            <option value="">ทั้งหมด</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Zone */}
        {selectedCity && ZONES[selectedCity] && (
          <div>
            <label className="block text-sm font-medium mb-2">โซน</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white"
            >
              <option value="">ทั้งหมด</option>
              {ZONES[selectedCity].map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        )}

        {/* Compensation Type */}
        <div>
          <label className="block text-sm font-medium mb-2">ประเภทค่าตอบแทน</label>
          <select
            value={selectedComp}
            onChange={(e) => setSelectedComp(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white"
          >
            <option value="">ทั้งหมด</option>
            {COMPENSATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        {/* Min Cash */}
        <div>
          <label className="block text-sm font-medium mb-2">เงินสดขั้นต่ำ</label>
          <input
            type="number"
            value={minCash}
            onChange={(e) => setMinCash(e.target.value)}
            placeholder="฿"
            className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white"
          />
        </div>

        {/* Via Team */}
        <div>
          <label className="block text-sm font-medium mb-2">ประเภท</label>
          <select
            value={viaTeam}
            onChange={(e) => setViaTeam(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-card border border-border text-white"
          >
            <option value="">ทั้งหมด</option>
            <option value="direct">รับตรง</option>
            <option value="team">ผ่านโม/ทีม</option>
          </select>
        </div>

        {/* Apply Button */}
        <Button className="w-full">
          ค้นหา
        </Button>
      </div>
    </div>
  )
}

