'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Users, Search, Filter, Mail, Phone, Wallet } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

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
      fetchUsers()
    }
  }, [session, status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let filtered = users

    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.handle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredUsers(filtered)
  }, [searchTerm, roleFilter, users])

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
          <h1 className="text-4xl font-bold mb-2 neon-text">จัดการผู้ใช้</h1>
          <p className="text-muted">ดูและจัดการผู้ใช้ทั้งหมดในระบบ</p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, อีเมล, handle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none appearance-none"
              >
                <option value="all">ทุกบทบาท</option>
                <option value="influencer">อินฟลูเอนเซอร์</option>
                <option value="bar">ร้านเหล้า/บาร์</option>
                <option value="admin">ผู้ดูแลระบบ</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted">
            <span>แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้</span>
          </div>
        </div>

        {/* Users List */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card">
                <tr className="text-left border-b border-border">
                  <th className="px-6 py-4 text-sm font-medium text-muted">ผู้ใช้</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">บทบาท</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">ติดต่อ</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">Wallet</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">สร้างเมื่อ</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">การกระทำ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted">@{user.handle || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                        user.role === 'bar' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-accent/20 text-accent'
                      }`}>
                        {user.role === 'admin' ? 'ผู้ดูแล' : 
                         user.role === 'bar' ? 'ร้าน' : 'อินฟลู'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail size={14} className="text-muted" />
                          <span className="text-muted">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={14} className="text-muted" />
                            <span className="text-muted">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Wallet size={14} className="text-primary" />
                        <span className="font-medium text-primary">
                          {formatCurrency(parseFloat(user.walletBalance || 0))}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {new Date(user.createdAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline">
                        ดูรายละเอียด
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-muted">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>ไม่พบผู้ใช้</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

