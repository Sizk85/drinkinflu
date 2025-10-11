# 🚀 Setup Guide - DrinkInflu Platform

คู่มือการติดตั้งและรันแพลตฟอร์ม DrinkInflu

## 📋 ข้อกำหนดเบื้องต้น

- **Node.js** 20 หรือสูงกว่า
- **Docker** และ **Docker Compose**
- **npm** หรือ **pnpm**

## 🎯 Quick Start (แนะนำ)

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

```bash
# สร้างไฟล์ .env.local (มีอยู่แล้วในโปรเจกต์)
# หรือแก้ไขตามต้องการ
cp .env.example .env.local
```

### 3. เริ่มระบบด้วย Docker Compose

```bash
# เริ่ม PostgreSQL, Redis, Web App และ Worker
docker compose up -d

# รอ 10-20 วินาที ให้ services ทั้งหมดพร้อม
```

### 4. Setup Database

```bash
# รัน migrations
npm run db:migrate

# Seed ข้อมูลตัวอย่าง
npm run db:seed
```

### 5. เปิดเบราว์เซอร์

```
http://localhost:3000
```

✅ เสร็จแล้ว! ระบบพร้อมใช้งาน

## 🧪 Test Accounts

หลังจาก seed ข้อมูล คุณสามารถใช้ account ทดสอบเหล่านี้:

| Role | Email | Password | คำอธิบาย |
|------|-------|----------|----------|
| **Admin** | admin@drinkinflu.com | admin123 | ผู้ดูแลระบบ |
| **Bar** | route66@bar.com | bar123 | ร้านเหล้า Route 66 |
| **Bar** | demon@bar.com | bar123 | ร้านเหล้า Demon Bar |
| **Influencer** | bella@influ.com | influ123 | อินฟลูเอนเซอร์ Bella |
| **Influencer** | max@influ.com | influ123 | อินฟลูเอนเซอร์ Max |

## 🛠️ Development Mode (ไม่ใช้ Docker)

หากต้องการพัฒนาโดยไม่ใช้ Docker:

### 1. เริ่ม PostgreSQL และ Redis

```bash
# เริ่มเฉพาะ Database services
docker compose up -d db redis
```

### 2. รัน Development Server

```bash
# Terminal 1: Next.js Dev Server
npm run dev

# Terminal 2: Worker (optional)
npm run worker
```

เปิด: http://localhost:3000

## 📊 Database Management

### เปิด Drizzle Studio (Database UI)

```bash
npm run db:studio
```

เปิด: https://local.drizzle.studio

### Reset Database

```bash
# ลบ volumes และเริ่มใหม่
docker compose down -v
docker compose up -d db redis

# รัน migrations และ seed อีกครั้ง
npm run db:migrate
npm run db:seed
```

## 🐛 Troubleshooting

### Port ถูกใช้งานอยู่แล้ว

ถ้า port 3000, 5432 หรือ 6379 ถูกใช้:

```bash
# หยุด services ที่ใช้ port ดังกล่าว
# หรือแก้ไข port ใน docker-compose.yml
```

### Database Connection Error

```bash
# ตรวจสอบว่า DB พร้อมแล้ว
docker compose logs db

# ลอง restart
docker compose restart db
```

### Migrations ไม่ผ่าน

```bash
# Generate migrations ใหม่
npm run db:generate

# รัน migrations
npm run db:migrate
```

## 📦 Docker Commands

```bash
# เริ่ม services ทั้งหมด
docker compose up -d

# ดู logs
docker compose logs -f web

# หยุด services
docker compose down

# Rebuild images
docker compose up -d --build

# ลบทั้งหมดรวม volumes
docker compose down -v
```

## 🏗️ Production Build

```bash
# Build production image
docker build -t drinkinflu:latest .

# รัน
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e REDIS_URL="..." \
  drinkinflu:latest
```

## 🌐 Deploy to Coolify

1. Push code ไปยัง Git repository
2. สร้าง New Resource ใน Coolify
3. เลือก Docker Compose deployment
4. ตั้งค่า environment variables
5. Deploy!

## 📝 Environment Variables ที่สำคัญ

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Redis
REDIS_URL="redis://host:6379"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-random-secret"

# Cloudflare R2 (optional)
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_URL="https://..."

# Platform Config
PLATFORM_COMMISSION=0.15
WITHDRAWAL_FEE=0.02
```

## 💡 Tips

1. **Development**: ใช้ `npm run dev` สำหรับ hot reload
2. **Database Changes**: รัน `npm run db:generate` หลังแก้ schema
3. **Debugging**: ดู logs ด้วย `docker compose logs -f`
4. **Performance**: ใช้ `docker compose up -d` แทน `npm run dev` ในการทดสอบ production-like environment

## 🆘 ต้องการความช่วยเหลือ?

- อ่าน [README.md](./README.md) สำหรับข้อมูลเพิ่มเติม
- ตรวจสอบ logs: `docker compose logs -f`
- ดู schema: `npm run db:studio`

---

Happy coding! 🎉 สร้างโดย DrinkInflu Team

