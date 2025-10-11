# 🪑 Seat Keeper / Proxy Booking System

## 📌 ภาพรวม

**Seat Keeper** คือระบบจองโต๊ะแทนที่เพิ่มเข้ามาในแพลตฟอร์ม DrinkInflu ช่วยให้:
- 🎯 **ลูกค้า**: จองให้คนไปนั่งโต๊ะรอก่อน ไม่ต้องกลัวไม่มีที่นั่ง
- 💰 **Seat Keeper**: รับงานนั่งโต๊ะแทน ได้รายได้เสริม 150-200฿/ชม.
- 💼 **Platform**: เก็บค่าธรรมเนียม 25% จาก Seat Keeper fee

---

## 🎯 Concept

### Flow การใช้งาน

```
1. ลูกค้าต้องการไปร้าน Demon Bar เวลา 23:00
   ↓
2. จองผ่าน Seat Booking (เลือกให้ Keeper ไปนั่งแทนตั้งแต่ 21:00)
   ↓
3. Seat Keeper รับงาน
   ↓
4. Keeper ไปร้านตอน 21:00, เช็คอินพร้อมถ่ายรูป
   ↓
5. ลูกค้ามาถึงตอน 23:00 → มีโต๊ะรอแล้ว!
   ↓
6. Keeper ได้เงิน 400฿ (2 ชม. × 200฿)
   Platform ได้ 100฿ (25%)
```

---

## 💻 Tech Implementation

### Database Schema

#### 1. `seat_keepers` table
```typescript
{
  id: uuid
  userId: uuid (ref users)
  isActive: boolean
  rating: decimal
  totalBookings: integer
  availableZones: jsonb  // ['ทองหล่อ', 'RCA']
  hourlyRate: decimal    // 150-200฿
  totalEarnings: decimal
}
```

#### 2. `seat_bookings` table
```typescript
{
  id: uuid
  customerId: uuid
  seatKeeperId: uuid
  venueName: string
  venueZone: string
  keeperStartTime: timestamp    // เวลาที่ Keeper ต้องไป
  customerArrivalTime: timestamp // เวลาที่ลูกค้ามา
  numberOfSeats: integer
  keeperFee: decimal
  platformFee: decimal
  totalAmount: decimal
  status: enum  // pending, confirmed, keeper_arrived, completed
  keeperCheckInProof: string    // URL รูปภาพ
}
```

---

## 🔌 API Endpoints

### Seat Bookings

#### POST `/api/seat-bookings`
สร้างการจองใหม่

**Request:**
```json
{
  "customerId": "uuid",
  "venueName": "Demon Bar",
  "venueZone": "ทองหล่อ",
  "keeperStartTime": "2025-10-11T21:00:00Z",
  "customerArrivalTime": "2025-10-11T23:00:00Z",
  "numberOfSeats": 2
}
```

**Response:**
```json
{
  "success": true,
  "booking": { ... },
  "pricing": {
    "totalHours": 2,
    "keeperFee": 400,
    "platformFee": 100,
    "totalAmount": 500
  }
}
```

#### POST `/api/seat-bookings/:id/accept`
Seat Keeper รับงาน

**Request:**
```json
{
  "seatKeeperId": "uuid"
}
```

#### POST `/api/seat-bookings/:id/checkin`
Seat Keeper เช็คอิน

**Request:**
```json
{
  "proofImageUrl": "https://..."
}
```

### Seat Keepers

#### POST `/api/seat-keepers`
สมัครเป็น Seat Keeper

**Request:**
```json
{
  "userId": "uuid",
  "availableZones": ["ทองหล่อ", "RCA"],
  "hourlyRate": 150
}
```

#### GET `/api/seat-keepers`
ดูรายการ Seat Keepers ทั้งหมด

---

## 🎨 UI Pages

### 1. `/seat-booking` - หน้าจองโต๊ะ (ลูกค้า)
- ฟอร์มกรอกข้อมูลร้าน (ชื่อ, โซน, ที่อยู่)
- เลือกวันที่และเวลาที่จะไปถึง
- ระบบแนะนำเวลาที่ Keeper ควรไป (ก่อน 1.5 ชม.)
- คำนวณราคาอัตโนมัติ
- แสดงสรุปค่าใช้จ่าย

### 2. `/seat-keeper` - Dashboard Seat Keeper
- แสดงสถิติ: รายได้รวม, งานที่ทำ, เรตติ้ง
- รายการงานที่กำลังดำเนินการ
- ปุ่มรับงานใหม่
- ปุ่มเช็คอิน (ถ่ายรูป)

---

## 💰 Pricing Logic

### การคำนวณราคา

```typescript
// lib/seat-keeper-pricing.ts

const DEFAULT_HOURLY_RATE = 150  // บาท/ชม.
const PLATFORM_FEE = 0.25        // 25%

function calculatePrice(startTime, endTime, hourlyRate = 150) {
  const hours = (endTime - startTime) / (1000 * 60 * 60)
  const keeperFee = hours * hourlyRate
  const platformFee = keeperFee * 0.25
  const totalAmount = keeperFee + platformFee
  
  return {
    totalHours: hours,
    keeperFee,      // เงินที่ Keeper ได้
    platformFee,    // เงินที่ Platform ได้
    totalAmount     // ที่ลูกค้าจ่าย
  }
}
```

### ตัวอย่าง

- Keeper ไป 21:00, ลูกค้ามา 23:00 (2 ชม.)
- Hourly Rate = 200฿
- **Keeper Fee** = 2 × 200 = 400฿
- **Platform Fee** = 400 × 25% = 100฿
- **Total** = 500฿ (ลูกค้าจ่าย)

Keeper ได้ **400฿**, Platform ได้ **100฿**

---

## 🔄 Workflow & States

### Booking States

1. **pending** - รอ Keeper รับงาน
2. **confirmed** - Keeper รับงานแล้ว
3. **keeper_arrived** - Keeper เช็คอินแล้ว
4. **customer_arrived** - ลูกค้ามาถึงแล้ว
5. **completed** - งานสำเร็จ จ่ายเงินแล้ว
6. **cancelled** - ยกเลิก

### ขั้นตอนการทำงาน

```
Customer books
    ↓
Status: pending
    ↓
Keeper accepts → Status: confirmed
    ↓
Keeper arrives & check-in → Status: keeper_arrived
    ↓
Customer arrives → Status: customer_arrived
    ↓
Payment processed → Status: completed
```

---

## 📱 Features

### ✅ ที่ทำเสร็จแล้ว

- [x] Database Schema (seat_keepers, seat_bookings)
- [x] API Routes (create, accept, checkin)
- [x] Pricing Calculator
- [x] Seat Booking Page (Customer)
- [x] Seat Keeper Dashboard
- [x] Check-in System
- [x] Navbar Links
- [x] Landing Page Section
- [x] Seed Data

### 🚧 ที่ควรทำต่อ (Optional)

- [ ] Notification System (แจ้งเตือนเมื่อมี Keeper รับงาน)
- [ ] Real-time Tracking (GPS Keeper)
- [ ] Photo Upload (Cloudflare R2 integration)
- [ ] Rating & Review System
- [ ] Auto-matching Keeper based on zone
- [ ] Payment Integration (Mock → Real)
- [ ] Cancellation Policy & Refunds
- [ ] Keeper Availability Calendar

---

## 🎯 Business Model

### Revenue Streams

1. **Platform Fee**: 25% จาก Keeper Fee
   - Keeper ได้ 150฿/ชม. → Platform ได้ ~50฿/ชม.
   
2. **Subscription** (Future):
   - Customer Premium: ไม่มี Platform Fee
   - Keeper Premium: รับงานก่อนใคร

### Target Market

- **Customers**: คนที่ไม่อยากไปร้านแต่หัวค่ำ
- **Seat Keepers**: อินฟลู, นักศึกษา, คนหารายได้เสริม
- **Venues**: ร้านที่มักเต็มเสมอ

### Pricing Strategy

- **Min Booking**: 1 ชม.
- **Max Booking**: 6 ชม.
- **Hourly Rate**: 150-200฿ (ตาม zone/demand)
- **Platform Fee**: 25%

---

## 🧪 Testing

### Test Accounts

```
Seat Keeper (Bella): bella@influ.com / influ123
Seat Keeper (Max): max@influ.com / influ123
Customer (Jay): jay@influ.com / influ123
```

### Test Booking

1. ล็อกอินเป็น Jay
2. ไป `/seat-booking`
3. กรอกข้อมูล:
   - Venue: Demon Bar
   - Zone: ทองหล่อ
   - Date: พรุ่งนี้
   - Arrival: 23:00
4. ชำระเงิน
5. ล็อกอินเป็น Bella (Seat Keeper)
6. ไป `/seat-keeper`
7. รับงาน
8. เช็คอิน (อัปโหลดรูป)

---

## 📊 Analytics

### Metrics to Track

- Total Bookings
- Average Booking Duration
- Keeper Utilization Rate
- Customer Satisfaction
- Platform Revenue
- Popular Zones
- Peak Hours

---

## 🚀 Deployment

ระบบพร้อมใช้งานแล้ว! เพียงรัน:

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed

# Start app
npm run dev
```

เข้าใช้งานที่: **http://localhost:3000**

---

## 💡 Tips

1. **แนะนำเวลา Keeper** = เวลาลูกค้า - 1.5 ชม.
2. **หัก Platform Fee** จาก Keeper Fee ไม่ใช่ Total Amount
3. **เช็คอินต้องมีรูป** เพื่อยืนยันว่าไปถึงจริง
4. **Payment Mock** ใช้ระบบ Wallet ภายใน

---

สร้างโดย DrinkInflu Team 🎉

