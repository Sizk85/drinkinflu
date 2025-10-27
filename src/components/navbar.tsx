'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { UserDropdown } from '@/components/user-dropdown'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'
  const isLoggedIn = !!session?.user

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">DI</div>
            <span className="text-2xl font-bold neon-text">DrinkInflu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="text-muted hover:text-white transition-colors">
              ค้นหางาน
            </Link>
            <Link href="/post-job" className="text-muted hover:text-white transition-colors">
              โพสต์งาน
            </Link>
            <Link href="/seat-booking" className="text-muted hover:text-white transition-colors">
              จองโต๊ะ
            </Link>
            <Link href="/seat-keeper" className="text-muted hover:text-white transition-colors">
              Seat Keeper
            </Link>
            <Link href="/teams" className="text-muted hover:text-white transition-colors">
              ทีม
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">เข้าสู่ระบบ</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>สมัครสมาชิก</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3">
            <Link href="/explore" className="block text-muted hover:text-white transition-colors py-2">
              ค้นหางาน
            </Link>
            <Link href="/post-job" className="block text-muted hover:text-white transition-colors py-2">
              โพสต์งาน
            </Link>
            <Link href="/seat-booking" className="block text-muted hover:text-white transition-colors py-2">
              จองโต๊ะ
            </Link>
            <Link href="/seat-keeper" className="block text-muted hover:text-white transition-colors py-2">
              Seat Keeper
            </Link>
            <Link href="/teams" className="block text-muted hover:text-white transition-colors py-2">
              ทีม
            </Link>
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="block">
                    <Button className="w-full">แดชบอร์ด</Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block">
                    <Button variant="ghost" className="w-full">เข้าสู่ระบบ</Button>
                  </Link>
                  <Link href="/auth/signup" className="block">
                    <Button className="w-full">สมัครสมาชิก</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

