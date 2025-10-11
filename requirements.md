# 🧠 SYSTEM PROMPT — สร้างเว็บแพลตฟอร์มรวมอินฟูล x ร้านเหล้า (Dark Theme / Party Vibes / Noto Sans Thai)
---

## 🎯 GOAL

สร้างแพลตฟอร์มตัวกลาง “เจ้าใหญ่” ให้ **ร้านเหล้า/บาร์** โพสต์งาน และให้ **อินฟลู/โม** รับงาน, ส่งหลักฐานโพสต์, รับเงิน ได้ครบในที่เดียว พร้อมแดชบอร์ด, ระบบคอมมิชชัน, กระเป๋าเงิน (wallet), และ **AI ตรวจโพสต์อัตโนมัติ** (วางโครง API ไว้ก่อน) — ทั้งหมดใน **ธีมดำสายปาร์ตี้**, ใช้ฟอนต์ **Noto Sans Thai**.

---

## 🧩 TECH STACK (ต้องใช้)

* **Framework**: Next.js 14 (App Router), TypeScript
* **UI**: Tailwind CSS + **shadcn/ui** (dark mode เป็นค่าเริ่มต้น)
* **Auth**: NextAuth (Email/Password + OAuth IG/Google placeholder)
* **DB**: PostgreSQL + Drizzle ORM (migrations + seed)
* **Storage**: Cloudflare R2 (อัปโหลดรูป/สกรีนสตอรี่)
* **Queue**: BullMQ (worker สำหรับตรวจโพสต์/จ่ายเงิน)
* **Payments**: ใช้ระบบ **Mock Payment ภายใน (ไม่เชื่อม Stripe/Omise จริง)**

  * มี endpoint `/api/mock-payment` สำหรับทดสอบเติมเงิน/ถอนเงินในระบบ Wallet ได้
  * จำลองการจ่ายให้ influencer / หักคอมมิชชันร้าน / ค่าธรรมเนียมถอนเงิน
* **Images**: next/image + sharp
* **Lint/Format**: ESLint + Prettier + Husky (pre-commit)
* **Deploy**: Docker + Coolify (มี Dockerfile/compose)

> โค้ดต้อง **พร้อมรัน**: `docker compose up -d` แล้วเว็บลุกขึ้นพร้อม DB/worker.

---

## 🎨 THEME & BRANDING

* **Dark theme** เป็นค่าเริ่มต้น, ฟีล **ไนท์คลับ/นีออน/เลเซอร์**
* **Font**: ติดตั้งและ set global เป็น **Noto Sans Thai** (wght 300/400/600/700)
* **Color Tokens (Tailwind CSS custom)**

  * `primary`: #8A2BE2 (Electric Purple)
  * `accent`: #00FFFF (Aqua)
  * `glow`: rgba(138,43,226,0.35)
  * `bg`: #0B0B11
  * `card`: #12121A
  * `muted`: #9AA0A6
* เอฟเฟกต์ **neon glow**, **glassmorphism** บางจุด (blur/bg-opacity) อย่างพอดี ไม่รก
* ปุ่ม/การ์ด **rounded-2xl**, เงา **soft**

---

## 🧭 IA / ROUTES (App Router)

* `/` — Landing (Hero, Value prop, CTA สำหรับ ร้าน/อินฟูล)
* `/explore` — ค้นหางาน (filters: เมือง/โซน, งบ, วัน, เงื่อนไขโพสต์, ให้โปร/ให้เงิน, ผ่านโม/ตรง)
* `/post-job` — ร้านลงงาน (ฟอร์ม + preview + คำนวณค่าใช้จ่าย)
* `/profiles/[handle]` — โปรไฟล์สาธารณะ อินฟูล/ร้าน
* `/auth/*` — Sign in/up/reset
* `/dashboard` — Hub เลือกบทบาท (Influencer / Bar / Admin)

  * `/dashboard/influencer` — งานที่รับ, ส่งหลักฐาน, กระเป๋าเงิน, ปฏิทิน
  * `/dashboard/bar` — สร้างงาน, ตรวจโพสต์, จ่ายเงิน, Analytics
  * `/dashboard/admin` — อนุมัติผู้ใช้, ตรวจงาน, ค่าคอม, รายงาน
* `/wallet` — เติม/ถอน (role-based)
* `/verify` — อัปโหลด/ตรวจหลักฐานโพสต์ (AI/Manual)
* `/teams` — (สำหรับโม) จัดการทีม, เชิญสมาชิก, แบ่งส่วนแบ่ง
* `/pricing` — แพ็กเกจร้าน/อินฟูล (Subscription)
* `/legal/*` — Terms, Privacy, Alcohol-ad guideline reminder (TH)

---

## 💼 FEATURE SPEC (สำคัญ)

### 1) โปรไฟล์สาธารณะ (Influencer/Bar)

* อินฟูล: รูป, bio, เมือง, โซนที่สะดวก, **IG stats (followers/reach เฉลี่ย)**, งานที่เคยทำ, rating
* ร้าน: โลโก้, โซน/เมือง, สไตล์เพลง, งบเฉลี่ย, รูปบรรยากาศ, rating

### 2) ฟอร์มลงงาน (ร้าน)

* วันที่/เวลา, จำนวนที่ต้องการ, เงื่อนไขโพสต์ (เช่น สตอรี่ 3 รูป + แท็กร้าน + เปิด location), ให้โปร/งบเงินสด
* ตัวอย่างข้อความดีล (auto-generate)
* **คำนวณต้นทุน** (ประมาณการ) ตามสูตรราคากลาง

### 3) หน้าค้นหางาน (Influencer)

* ฟิลเตอร์: เมือง/โซน, วัน, งบ, ประเภทโพสต์, ผ่านโม/ตรง
* การ์ดงาน: title, ร้าน, งบ/โปร, requirement snapshot, CTA “รับงาน”

### 4) ระบบตรวจโพสต์ (AI Verify + Manual)

* โครง API `POST /api/verify` รับ URL/ไฟล์หลักฐาน → คืน `ai_score`, `ig_tagged`, `location_ok`
* แดชบอร์ดแสดงสถานะ: pending / auto_pass / manual_pass / fail

### 5) Wallet & Mock Payment

* ร้านเติมเงินเข้า wallet ผ่าน `/api/mock-payment/topup`
* อินฟูลถอนเงินผ่าน `/api/mock-payment/withdraw`
* ระบบจำลองจ่ายจริง / หักคอม / ค่าธรรมเนียมถอน / บันทึกธุรกรรมใน DB

### 6) Teams (โม)

* สร้างทีม, เพิ่มสมาชิก, ตั้ง `%` ส่วนแบ่ง, แจกงานให้ลูกทีม, รวมสรุปรายได้ทีม

### 7) Subscriptions (SaaS)

* **ร้านแพ็กเกจ**: Basic, Pro, Business
* **อินฟูล Premium**: Verified Badge + Boost โปรไฟล์ + เห็นงานก่อน

### 8) Reviews & Ratings

* 1–5 ดาว + คอมเมนต์ หลังจบงาน ทั้งสองฝั่ง

---

## 🔢 PRICING LOGIC (lib/pricing.ts)

```ts
export function calcInfluencerRate({ reach, location, isTeam }: { reach: number; location: string; isTeam?: boolean }) {
  let base = 600;
  if (reach > 5000) base += 300;
  if (reach > 10000) base += 500;
  if (["ทองหล่อ", "RCA", "ภูเก็ต"].includes(location)) base += 200;
  if (isTeam) base *= 0.9;
  return Math.round(base);
}
```

---

## 🧑‍💻 UI/COMPONENTS

* `Navbar` (โลโก้ neon, CTA: “สำหรับร้าน”, “สำหรับอินฟูล”)
* `Hero` (ภาพพื้นหลัง grain + neon glow)
* `JobCard`, `ProfileCard`, `WalletCard`, `VerifyStatusBadge`
* `Stepper`, `Toast`, `CommandPalette`, `FiltersSheet`

---

## 📝 TASKS ให้ AI ลงมือทำทันที

1. ตั้งโปรเจ็กต์ Next.js 14 + TS + shadcn/ui + Tailwind (โหมดมืด default) + ฟอนต์ Noto Sans Thai
2. ตั้ง Drizzle + schema + seed ข้อมูลตัวอย่าง
3. ทำหน้า `/`, `/explore`, `/post-job`, `/dashboard/(influencer|bar|admin)`
4. เขียน API routes: auth, jobs, applications, posts(verify), wallet, mock-payment
5. ใส่ pricing logic + คอมมิชชัน 15%
6. เตรียม Dockerfile + compose (web/db/redis/worker)
7. ใส่ COPY ภาษาไทย + ปรับโทนธีมดำสายปาร์ตี้

> ส่งมอบโค้ดที่ **รันได้จริง** พร้อม README อธิบายการตั้งค่า ENV/Deploy.
