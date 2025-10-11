# ✅ Environment Variables Checklist

## 🔴 **จำเป็นต้องมี (Required) - ต้องตั้งใน Coolify**

### 1. Database
```bash
DATABASE_URL=postgres://postgres:PASSWORD@HOST:5432/postgres
```
📝 Coolify จะสร้างให้อัตโนมัติ

### 2. NextAuth (สำคัญมาก!)
```bash
NEXTAUTH_URL=https://drinkinflu.ipun.me
NEXTAUTH_SECRET=294664c2ce2aa75067bde4a13483ec60
AUTH_SECRET=294664c2ce2aa75067bde4a13483ec60
```
⚠️ ต้องตั้งเอง! ห้ามลืม!

### 3. Redis
```bash
REDIS_URL=redis://default:PASSWORD@HOST:6379/0
```
📝 Coolify จะสร้างให้ (ถ้าเพิ่ม Redis service)

---

## 🟡 **แนะนำให้มี (Recommended)**

### 4. Platform Config
```bash
PLATFORM_COMMISSION=0.15
WITHDRAWAL_FEE=0.02
```
💡 มีค่า default ในโค้ด แต่ควรตั้งเพื่อปรับค่าได้ง่าย

---

## 🟢 **Optional (ไม่มีก็รันได้)**

### 5. Google OAuth (ถ้าต้องการ Login ด้วย Google)
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
💡 ไม่มีก็ยังใช้ Email/Password Login ได้

### 6. Cloudflare R2 (ถ้าต้องการอัปโหลดรูปจริง)
```bash
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=drinkinflu-uploads
R2_PUBLIC_URL=https://your-bucket.r2.dev
```
💡 ไม่มีจะใช้ Mock (local uploads)

---

## 📋 **สรุป ENV ที่คุณตั้งไว้แล้ว:**

✅ `DATABASE_URL` - มีแล้ว  
✅ `NEXTAUTH_URL` - มีแล้ว  
✅ `NEXTAUTH_SECRET` - มีแล้ว  
✅ `AUTH_SECRET` - มีแล้ว  
✅ `REDIS_URL` - มีแล้ว  

---

## ⚠️ **ที่ควรเพิ่มเข้าไปใน Coolify:**

```bash
PLATFORM_COMMISSION=0.15
WITHDRAWAL_FEE=0.02
```

แค่นี้ก็พอครับ! ที่เหลือเป็น optional

---

## 🎯 **ENV ทั้งหมดสำหรับ Copy-Paste:**

```bash
# === Required ===
DATABASE_URL=postgres://postgres:lGi3aShn7allFmqADg9wi35tFJEDfKiXCde8RQeEN55VOGoBKxiynU0ZDUqh4kn3@awk0ocss8w044wc808s0w488:5432/postgres
NEXTAUTH_URL=https://drinkinflu.ipun.me
NEXTAUTH_SECRET=294664c2ce2aa75067bde4a13483ec60
AUTH_SECRET=294664c2ce2aa75067bde4a13483ec60
REDIS_URL=redis://default:iHI3IcAo4As9Qsi7TaDKDEqBOQ7SxTppH1GsltMUguGfici81j090iHSxXNqnK3u@po04ww4so00owkgoc0o88ssg:6379/0

# === Recommended ===
PLATFORM_COMMISSION=0.15
WITHDRAWAL_FEE=0.02

# === Optional (ใส่ตอนหลังได้) ===
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# R2_ACCOUNT_ID=
# R2_ACCESS_KEY_ID=
# R2_SECRET_ACCESS_KEY=
# R2_BUCKET_NAME=drinkinflu-uploads
# R2_PUBLIC_URL=https://uploads.drinkinflu.com
```

---

## 🚨 **Important:**
1. **ห้าม commit ไฟล์ที่มี ENV values จริง!** (จะเป็นอันตราย)
2. ENV ตั้งใน Coolify Dashboard เท่านั้น
3. ไฟล์ที่ commit ควรเป็น `.env.example` (ไม่มีค่าจริง)

---

**ที่คุณมีครบแล้ว:** DATABASE_URL, NEXTAUTH_*, REDIS_URL ✅  
**ควรเพิ่ม:** PLATFORM_COMMISSION, WITHDRAWAL_FEE  

แค่นี้ก็พอใช้งานได้แล้วครับ! 🎉

