'use client'

import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowUpCircle, ArrowDownCircle, Filter, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'
import { formatDistance } from 'date-fns'
import { th } from 'date-fns/locale'

export default function AdminTransactionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTxs, setFilteredTxs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')

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
      fetchTransactions()
    }
  }, [session, status, router])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions')
      const data = await response.json()
      
      if (data.success) {
        setTransactions(data.transactions)
        setFilteredTxs(data.transactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (typeFilter === 'all') {
      setFilteredTxs(transactions)
    } else {
      setFilteredTxs(transactions.filter(tx => tx.type === typeFilter))
    }
  }, [typeFilter, transactions])

  const totalRevenue = transactions
    .filter(tx => tx.type === 'commission')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)

  const totalPaidOut = transactions
    .filter(tx => tx.type === 'job_received')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)

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
          <h1 className="text-4xl font-bold mb-2 neon-text">ประวัติธุรกรรม</h1>
          <p className="text-muted">ดูธุรกรรมทั้งหมดในระบบ</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-muted mb-2">รายการทั้งหมด</div>
            <div className="text-3xl font-bold">{transactions.length}</div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-muted mb-2">รายได้ Platform</div>
            <div className="text-3xl font-bold text-green-500">
              {formatCurrency(totalRevenue)}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="text-sm text-muted mb-2">จ่ายให้ Influencers</div>
            <div className="text-3xl font-bold text-red-500">
              {formatCurrency(totalPaidOut)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="text-muted" size={18} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-xl bg-card border border-border focus:border-primary focus:outline-none"
            >
              <option value="all">ทุกประเภท</option>
              <option value="topup">เติมเงิน</option>
              <option value="withdrawal">ถอนเงิน</option>
              <option value="job_payment">จ่ายงาน</option>
              <option value="job_received">รับเงิน</option>
              <option value="commission">คอมมิชชัน</option>
            </select>

            <Button variant="outline" size="sm" className="ml-auto">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card">
                <tr className="text-left border-b border-border">
                  <th className="px-6 py-4 text-sm font-medium text-muted">เวลา</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">ผู้ใช้</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">ประเภท</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted">รายละเอียด</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted text-right">จำนวนเงิน</th>
                  <th className="px-6 py-4 text-sm font-medium text-muted text-right">ยอดคงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map((tx) => {
                  const isPositive = parseFloat(tx.amount) > 0
                  const formattedDate = formatDistance(new Date(tx.createdAt), new Date(), {
                    addSuffix: true,
                    locale: th,
                  })

                  return (
                    <tr key={tx.id} className="border-b border-border hover:bg-card/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-muted">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          User #{tx.userId?.slice(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          tx.type === 'topup' ? 'bg-blue-500/20 text-blue-400' :
                          tx.type === 'withdrawal' ? 'bg-red-500/20 text-red-500' :
                          tx.type === 'job_received' ? 'bg-green-500/20 text-green-500' :
                          tx.type === 'commission' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {tx.type === 'topup' ? 'เติมเงิน' :
                           tx.type === 'withdrawal' ? 'ถอนเงิน' :
                           tx.type === 'job_received' ? 'รับเงิน' :
                           tx.type === 'job_payment' ? 'จ่ายงาน' :
                           tx.type === 'commission' ? 'คอมมิชชัน' : tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        {tx.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className={`font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{formatCurrency(parseFloat(tx.amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-muted">
                        {formatCurrency(parseFloat(tx.balanceAfter))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredTxs.length === 0 && (
            <div className="p-12 text-center text-muted">
              <p>ไม่พบธุรกรรม</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

