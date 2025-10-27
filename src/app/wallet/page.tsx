'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatCurrency, calcWithdrawal } from '@/lib/pricing'
import { formatDistance } from 'date-fns'
import { th } from 'date-fns/locale'

export default function WalletPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<'topup' | 'withdraw'>('topup')
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch wallet data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.email) {
      fetchWalletData()
    }
  }, [session, status, router])

  const fetchWalletData = async () => {
    try {
      // Fetch balance
      const balanceRes = await fetch('/api/wallet/balance')
      const balanceData = await balanceRes.json()
      setBalance(balanceData.balance || 0)

      // Fetch transactions
      const txRes = await fetch('/api/wallet/transactions')
      const txData = await txRes.json()
      setTransactions(txData.transactions || [])
    } catch (error) {
      console.error('Error fetching wallet data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const amt = parseFloat(amount)
      if (isNaN(amt) || amt <= 0) {
        throw new Error('กรุณาระบุจำนวนเงินที่ถูกต้อง')
      }

      if (mode === 'withdraw' && amt > balance) {
        throw new Error('ยอดเงินไม่เพียงพอ')
      }

      // TODO: Call API
      if (mode === 'topup') {
        setBalance(balance + amt)
        toast({
          title: 'เติมเงินสำเร็จ!',
          description: `เติมเงิน ${formatCurrency(amt)} เข้า Wallet`,
        })
      } else {
        const withdrawal = calcWithdrawal(amt)
        setBalance(balance - amt)
        toast({
          title: 'ถอนเงินสำเร็จ!',
          description: `คุณจะได้รับ ${formatCurrency(withdrawal.receivedAmount)} (หักค่าธรรมเนียม ${formatCurrency(withdrawal.fee)})`,
        })
      }

      setAmount('')
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const withdrawalPreview = amount && parseFloat(amount) > 0 ? calcWithdrawal(parseFloat(amount)) : null

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-12">
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
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 neon-text">กระเป๋าเงิน</h1>
          <p className="text-muted">เติม/ถอนเงินได้ง่ายๆ</p>
        </div>

        {/* Balance Card */}
        <div className="glass rounded-2xl p-8 mb-8 text-center glow-primary">
          <WalletIcon className="mx-auto mb-4 text-primary" size={48} />
          <div className="text-sm text-muted mb-2">ยอดคงเหลือ</div>
          <div className="text-5xl font-bold text-primary mb-2">
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-muted">พร้อมถอนได้ทันที</p>
        </div>

        {/* Mode Toggle */}
        <div className="glass rounded-2xl p-2 mb-8 grid grid-cols-2 gap-2">
          <Button
            variant={mode === 'topup' ? 'default' : 'ghost'}
            onClick={() => setMode('topup')}
            className="flex items-center gap-2"
          >
            <ArrowUpCircle size={20} />
            เติมเงิน
          </Button>
          <Button
            variant={mode === 'withdraw' ? 'default' : 'ghost'}
            onClick={() => setMode('withdraw')}
            className="flex items-center gap-2"
          >
            <ArrowDownCircle size={20} />
            ถอนเงิน
          </Button>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {mode === 'topup' ? 'เติมเงินเข้า Wallet' : 'ถอนเงินออก'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">จำนวนเงิน</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-muted">฿</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-card border border-border text-white text-lg"
                />
              </div>
            </div>

            {/* Withdrawal Preview */}
            {mode === 'withdraw' && withdrawalPreview && (
              <div className="mb-4 p-4 bg-card rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">จำนวนที่ถอน:</span>
                  <span>{formatCurrency(withdrawalPreview.requestedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">ค่าธรรมเนียม (2%):</span>
                  <span className="text-red-500">- {formatCurrency(withdrawalPreview.fee)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-border">
                  <span>คุณจะได้รับ:</span>
                  <span className="text-primary">{formatCurrency(withdrawalPreview.receivedAmount)}</span>
                </div>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[1000, 2000, 5000, 10000].map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                >
                  {amt.toLocaleString()}
                </Button>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing
                ? 'กำลังดำเนินการ...'
                : mode === 'topup'
                ? 'เติมเงิน'
                : 'ถอนเงิน'}
            </Button>

            {mode === 'topup' && (
              <p className="text-xs text-muted text-center mt-3">
                💳 ชำระผ่าน QR Code, โอนเงิน หรือบัตรเครดิต
              </p>
            )}
          </form>
        </div>

        {/* Transaction History */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">ประวัติการทำรายการ</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <p>ยังไม่มีรายการ</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const isPositive = parseFloat(tx.amount) > 0
                const formattedDate = formatDistance(new Date(tx.createdAt), new Date(), {
                  addSuffix: true,
                  locale: th,
                })
                
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {isPositive ? (
                          <ArrowUpCircle className="text-green-500" size={20} />
                        ) : (
                          <ArrowDownCircle className="text-red-500" size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.description || tx.type}</div>
                        <div className="text-xs text-muted">{formattedDate}</div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isPositive ? '+' : ''}{formatCurrency(Math.abs(parseFloat(tx.amount)))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

