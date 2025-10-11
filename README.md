# 🍸 DrinkInflu - แพลตฟอร์มเชื่อมร้านเหล้ากับอินฟลูเอนเซอร์

> **ตัวกลางเจ้าใหญ่** ให้ร้านเหล้า/บาร์โพสต์งาน และให้อินฟลูเอนเซอร์รับงาน ส่งหลักฐานโพสต์ รับเงิน ได้ครบในที่เดียว

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)

## 🎯 คุณสมบัติหลัก

### 🍺 สำหรับร้านเหล้า/บาร์
- ✅ โพสต์งานง่าย พร้อมคำนวณต้นทุนอัตโนมัติ
- ✅ เลือกอินฟลูที่ใช่ ดูสถิติจริง
- ✅ AI ตรวจโพสต์อัตโนมัติ
- ✅ จ่ายผ่าน Wallet ปลอดภัย

### ⭐ สำหรับอินฟลูเอนเซอร์
- ✅ หางานง่าย ฟิลเตอร์ตามโซนที่สะดวก
- ✅ รับเงินไว ถอนง่าย
- ✅ สร้างโปรไฟล์ โชว์ผลงาน
- ✅ ระบบรีวิว สร้างชื่อเสียง

### 👥 สำหรับโม/ทีม
- ✅ จัดการทีมในที่เดียว
- ✅ แบ่งส่วนแบ่งอัตโนมัติ (คอมมิชชัน 15%)
- ✅ แจกงานให้ลูกทีม
- ✅ ดูรายได้รวมทั้งทีม

### 🪑 NEW! Seat Keeper (Proxy Booking)
- ✅ **ลูกค้า**: จองให้คนไปนั่งโต๊ะรอก่อน ไม่ต้องกลัวไม่มีที่นั่ง
- ✅ **Seat Keeper**: รับงานนั่งโต๊ะแทน ได้รายได้เสริม 150-200฿/ชม.
- ✅ Check-in System พร้อมถ่ายรูปยืนยัน
- ✅ Platform Fee 25%

## 🧩 Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui (Dark Theme)
- **Font**: Noto Sans Thai
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Cache/Queue**: Redis + BullMQ
- **Storage**: Cloudflare R2 (Mock)
- **Payment**: Mock Payment System
- **Container**: Docker + Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or pnpm

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd drinkinflu

# Install dependencies
npm install
```

### 2. Environment Variables

```bash
# Copy example env
cp .env.example .env.local

# ตั้งค่าตามที่ต้องการ (สำหรับ development ใช้ค่า default ได้เลย)
```

### 3. Start with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Web, Worker)
docker compose up -d

# Check logs
docker compose logs -f web
```

### 4. Database Migration & Seed

```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### 5. เข้าใช้งาน

เปิดเบราว์เซอร์ไปที่: **http://localhost:3000**

## 🧪 Test Accounts

หลังจากรัน seed จะได้ account ทดสอบ:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@drinkinflu.com | admin123 |
| Bar | route66@bar.com | bar123 |
| Influencer | bella@influ.com | influ123 |

## 📂 Project Structure

```
drinkinflu/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── jobs/          # งาน CRUD
│   │   │   ├── applications/  # สมัครงาน
│   │   │   ├── verify/        # ตรวจโพสต์ AI
│   │   │   └── mock-payment/  # Mock Payment (topup/withdraw)
│   │   ├── explore/           # หน้าค้นหางาน
│   │   ├── post-job/          # หน้าโพสต์งาน (ร้าน)
│   │   ├── dashboard/         # Dashboard (influencer/bar/admin)
│   │   └── ...
│   ├── components/            # React Components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── job-card.tsx
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── pricing.ts        # คำนวณราคา + คอมมิชชัน
│   │   ├── constants.ts      # Constants (เมือง, โซน, ฯลฯ)
│   │   ├── date-utils.ts
│   │   └── utils.ts
│   ├── db/                    # Database
│   │   ├── schema.ts         # Drizzle Schema
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   └── seed.ts
│   └── worker/                # BullMQ Workers
│       └── index.ts
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.worker
├── drizzle.config.ts
├── tailwind.config.ts
└── package.json
```

## 🎨 Design Theme

- **Dark Theme** - ฟีลไนท์คลับ/นีออน/เลเซอร์
- **Colors**:
  - Primary: `#8A2BE2` (Electric Purple)
  - Accent: `#00FFFF` (Aqua)
  - Background: `#0B0B11`
  - Card: `#12121A`
- **Effects**: Neon glow, Glassmorphism, Grain overlay

## 💰 Pricing & Commission

```typescript
// ตัวอย่างการคำนวณราคา
calcInfluencerRate({
  reach: 10000,        // IG reach
  location: 'ทองหล่อ', // โซนพรีเมียม +200฿
  isTeam: false        // ไม่ผ่านทีม
})
// => ฿1,600

// ค่าคอมมิชชันแพลตฟอร์ม: 15%
// ค่าธรรมเนียมถอนเงิน: 2%
```

## 🔌 API Endpoints

### Jobs
- `GET /api/jobs` - ดึงรายการงาน
- `POST /api/jobs` - สร้างงานใหม่

### Applications
- `GET /api/applications` - ดึงรายการสมัครงาน
- `POST /api/applications` - สมัครงาน

### Verification (AI Placeholder)
- `POST /api/verify` - ตรวจโพสต์ด้วย AI
- `PATCH /api/verify` - อนุมัติ/ปฏิเสธด้วยตนเอง

### Mock Payment
- `POST /api/mock-payment/topup` - เติมเงิน Wallet
- `POST /api/mock-payment/withdraw` - ถอนเงิน

### Seat Keeper (NEW!)
- `GET /api/seat-bookings` - ดูการจอง
- `POST /api/seat-bookings` - สร้างการจองใหม่
- `POST /api/seat-bookings/:id/accept` - Keeper รับงาน
- `POST /api/seat-bookings/:id/checkin` - Keeper เช็คอิน
- `GET /api/seat-keepers` - ดูรายการ Keeper
- `POST /api/seat-keepers` - สมัครเป็น Keeper

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate      # Generate Drizzle migrations
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:studio        # Open Drizzle Studio

# Linting & Formatting
npm run lint
npm run format
```

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build

# Remove volumes (reset database)
docker compose down -v
```

## 📋 Database Schema

หลักๆ ประกอบด้วย:

- **users** - ผู้ใช้ (admin, bar, influencer) + Wallet
- **jobs** - งานที่ร้านโพสต์
- **applications** - การสมัครงานของอินฟลู + สถานะตรวจสอบ
- **teams** - ทีมของโม
- **teamMembers** - สมาชิกในทีม
- **transactions** - ธุรกรรม Wallet (เติม/ถอน/รับเงิน)
- **reviews** - รีวิวระหว่างร้านกับอินฟลู
- **subscriptions** - แพ็กเกจสมาชิก
- **seatKeepers** - Seat Keeper profiles (NEW!)
- **seatBookings** - การจองโต๊ะ (NEW!)

## 🚧 TODO / Roadmap

- [ ] NextAuth Integration (Email/Password + OAuth)
- [ ] Dashboard pages (Influencer/Bar/Admin)
- [ ] Profile pages
- [ ] Wallet & Teams pages
- [ ] Real AI Verification (Computer Vision)
- [ ] Real Payment Gateway Integration
- [ ] Real-time notifications
- [ ] Mobile App (React Native)

## 📝 License

MIT License - สามารถนำไปใช้ได้เลย!

## 🙏 Credits

พัฒนาด้วย ❤️ โดย **DrinkInflu Team**

---

⚠️ **คำเตือน**: กรุณาดื่มอย่างมีความรับผิดชอบ | สำหรับผู้ที่มีอายุ 18 ปีขึ้นไปเท่านั้น

