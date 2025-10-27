'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User, Wallet, Settings, LogOut, ChevronDown } from 'lucide-react'
import { formatCurrency } from '@/lib/pricing'

export function UserDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch wallet balance
  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/wallet/balance')
        .then(r => r.json())
        .then(data => setWalletBalance(data.balance || 0))
        .catch(() => setWalletBalance(0))
    }
  }, [session])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session?.user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
          <User size={18} className="text-accent" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium">{session.user.name}</div>
          <div className="text-xs text-muted">{formatCurrency(walletBalance)}</div>
        </div>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass rounded-xl border border-border overflow-hidden shadow-xl">
          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="font-medium mb-1">{session.user.name}</div>
            <div className="text-sm text-muted mb-2">{session.user.email}</div>
            <div className="flex items-center gap-2 text-sm">
              <Wallet size={14} className="text-primary" />
              <span className="font-bold text-primary">{formatCurrency(walletBalance)}</span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link 
              href="/profiles/me"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <User size={18} className="text-muted" />
              <span>โปรไฟล์ของฉัน</span>
            </Link>

            <Link 
              href="/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Wallet size={18} className="text-muted" />
              <span>กระเป๋าเงิน</span>
            </Link>

            <Link 
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Settings size={18} className="text-muted" />
              <span>แดชบอร์ด</span>
            </Link>

            {session.user.role === 'admin' && (
              <Link 
                href="/dashboard/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors"
              >
                <Settings size={18} className="text-accent" />
                <span className="text-accent font-medium">ผู้ดูแลระบบ</span>
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-border">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: '/' })
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors w-full text-left"
            >
              <LogOut size={18} className="text-red-500" />
              <span className="text-red-500">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

