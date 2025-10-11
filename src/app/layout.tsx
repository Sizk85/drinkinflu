import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/session-provider'

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-noto-sans-thai',
})

export const metadata: Metadata = {
  title: 'DrinkInflu - แพลตฟอร์มเชื่อมร้านเหล้ากับอินฟลู',
  description: 'ตัวกลางเจ้าใหญ่ให้ร้านเหล้า/บาร์โพสต์งาน และให้อินฟลูเอนเซอร์รับงาน ได้ครบในที่เดียว',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <body className={`${notoSansThai.variable} font-sans bg-[#0B0B11] text-white antialiased`}>
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
