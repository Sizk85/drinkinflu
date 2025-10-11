// City and zone constants for Thailand nightlife
export const CITIES = [
  'กรุงเทพฯ',
  'ภูเก็ต',
  'พัทยา',
  'เชียงใหม่',
  'หัวหิน',
  'เกาะสมุย',
  'กระบี่',
] as const

export const BANGKOK_ZONES = [
  'ทองหล่อ',
  'RCA',
  'เอกมัย',
  'สุขุมวิท',
  'สีลม',
  'ข้าวสาร',
  'อารีย์',
  'สยาม',
] as const

export const PHUKET_ZONES = [
  'ป่าตอง',
  'กะตะ',
  'กะรน',
  'ภูเก็ตทาวน์',
] as const

export const ZONES: Record<string, readonly string[]> = {
  'กรุงเทพฯ': BANGKOK_ZONES,
  'ภูเก็ต': PHUKET_ZONES,
  'พัทยา': ['วอล์คกิ้งสตรีท', 'ถนนชายหาด', 'นาเกลือ'],
  'เชียงใหม่': ['นิมมาน', 'ช้างคลาน', 'ประตูท่าแพ'],
  'หัวหิน': ['ตลาดโต้รุ่ง', 'ชายหาดหัวหิน'],
  'เกาะสมุย': ['เฉวง', 'ละไม', 'บ่อผุด'],
  'กระบี่': ['อ่าวนาง', 'กระบี่ทาวน์'],
}

// Music styles for bars
export const MUSIC_STYLES = [
  'EDM',
  'Hip Hop',
  'Techno',
  'House',
  'Trap',
  'R&B',
  'Pop',
  'Rock',
  'Thai Pop',
  'Live Band',
  'Mix',
] as const

// Job compensation types
export const COMPENSATION_TYPES = [
  { value: 'cash', label: 'เงินสด' },
  { value: 'drinks', label: 'เครื่องดื่มฟรี' },
  { value: 'both', label: 'เงินสด + เครื่องดื่ม' },
] as const

// Subscription plans
export const BAR_PLANS = [
  {
    id: 'bar_basic',
    name: 'Basic',
    price: 990,
    features: [
      'โพสต์งานได้ 5 งาน/เดือน',
      'ค่าคอมมิชชัน 15%',
      'ตรวจ AI อัตโนมัติ',
      'รายงานพื้นฐาน',
    ],
  },
  {
    id: 'bar_pro',
    name: 'Pro',
    price: 2490,
    features: [
      'โพสต์งานไม่จำกัด',
      'ค่าคอมมิชชัน 12%',
      'ตรวจ AI + Priority Support',
      'รายงานเต็มรูปแบบ',
      'โปรโมทงานของคุณ',
    ],
    popular: true,
  },
  {
    id: 'bar_business',
    name: 'Business',
    price: 4990,
    features: [
      'โพสต์งานไม่จำกัด',
      'ค่าคอมมิชชัน 10%',
      'Dedicated Account Manager',
      'Analytics ระดับ Enterprise',
      'API Access',
      'Custom Branding',
    ],
  },
] as const

export const INFLUENCER_PLANS = [
  {
    id: 'influencer_free',
    name: 'Free',
    price: 0,
    features: [
      'หางานได้ไม่จำกัด',
      'ถอนเงินค่าธรรมเนียม 2%',
      'โปรไฟล์พื้นฐาน',
    ],
  },
  {
    id: 'influencer_premium',
    name: 'Premium',
    price: 299,
    features: [
      'Verified Badge ✓',
      'ถอนเงินค่าธรรมเนียม 1%',
      'โปรไฟล์โดดเด่น',
      'เห็นงานก่อนใคร',
      'Boost โปรไฟล์',
    ],
    popular: true,
  },
] as const

// Status colors
export const STATUS_COLORS = {
  open: 'bg-green-500',
  in_progress: 'bg-blue-500',
  completed: 'bg-purple-500',
  cancelled: 'bg-gray-500',
  pending: 'bg-yellow-500',
  accepted: 'bg-green-500',
  rejected: 'bg-red-500',
} as const

// Verification statuses
export const VERIFICATION_STATUSES = {
  pending_proof: { label: 'รอส่งหลักฐาน', color: 'bg-gray-500' },
  ai_checking: { label: 'AI กำลังตรวจสอบ', color: 'bg-blue-500' },
  auto_pass: { label: 'ผ่าน (AI)', color: 'bg-green-500' },
  manual_review: { label: 'รอตรวจสอบด้วยตนเอง', color: 'bg-yellow-500' },
  approved: { label: 'อนุมัติ', color: 'bg-green-600' },
  rejected: { label: 'ไม่ผ่าน', color: 'bg-red-500' },
} as const

