/**
 * Seat Keeper Pricing Calculator
 */

export const DEFAULT_HOURLY_RATE = 150 // บาท/ชั่วโมง
export const PLATFORM_FEE_PERCENTAGE = 0.25 // 25% ของค่า Keeper
export const MIN_BOOKING_HOURS = 1
export const MAX_BOOKING_HOURS = 6

/**
 * คำนวณราคาสำหรับการจอง Seat Keeper
 */
export function calculateSeatKeeperPrice(params: {
  startTime: Date
  endTime: Date
  hourlyRate?: number
}): {
  totalHours: number
  keeperFee: number
  platformFee: number
  totalAmount: number
} {
  const { startTime, endTime, hourlyRate = DEFAULT_HOURLY_RATE } = params

  // คำนวณจำนวนชั่วโมง
  const diffMs = endTime.getTime() - startTime.getTime()
  const totalHours = Math.max(diffMs / (1000 * 60 * 60), MIN_BOOKING_HOURS)

  // คำนวณค่าใช้จ่าย
  const keeperFee = Math.round(totalHours * hourlyRate)
  const platformFee = Math.round(keeperFee * PLATFORM_FEE_PERCENTAGE)
  const totalAmount = keeperFee + platformFee

  return {
    totalHours: Math.round(totalHours * 100) / 100,
    keeperFee,
    platformFee,
    totalAmount,
  }
}

/**
 * คำนวณรายได้ของ Seat Keeper หลังหัก Platform fee
 */
export function calculateKeeperEarnings(totalAmount: number): {
  keeperEarnings: number
  platformRevenue: number
} {
  const keeperEarnings = Math.round(totalAmount * (1 - PLATFORM_FEE_PERCENTAGE))
  const platformRevenue = totalAmount - keeperEarnings

  return {
    keeperEarnings,
    platformRevenue,
  }
}

/**
 * แนะนำเวลาที่ Seat Keeper ควรไป
 */
export function suggestKeeperStartTime(
  customerArrivalTime: Date,
  bufferHours: number = 1.5
): Date {
  const startTime = new Date(customerArrivalTime)
  startTime.setHours(startTime.getHours() - bufferHours)
  return startTime
}

/**
 * Validate booking time
 */
export function validateBookingTime(
  keeperStartTime: Date,
  customerArrivalTime: Date
): { valid: boolean; error?: string } {
  const now = new Date()
  const diffHours = (customerArrivalTime.getTime() - keeperStartTime.getTime()) / (1000 * 60 * 60)

  if (keeperStartTime < now) {
    return { valid: false, error: 'เวลาเริ่มต้องเป็นอนาคต' }
  }

  if (customerArrivalTime <= keeperStartTime) {
    return { valid: false, error: 'เวลาที่ลูกค้ามาต้องหลังจาก Seat Keeper ไปถึง' }
  }

  if (diffHours < MIN_BOOKING_HOURS) {
    return { valid: false, error: `ต้องจองขั้นต่ำ ${MIN_BOOKING_HOURS} ชั่วโมง` }
  }

  if (diffHours > MAX_BOOKING_HOURS) {
    return { valid: false, error: `จองได้สูงสุด ${MAX_BOOKING_HOURS} ชั่วโมง` }
  }

  return { valid: true }
}

