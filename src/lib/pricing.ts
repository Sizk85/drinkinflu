// Pricing logic for the platform
export const PLATFORM_COMMISSION = 0.15 // 15% commission
export const WITHDRAWAL_FEE = 0.02 // 2% withdrawal fee

export interface InfluencerRateParams {
  reach: number
  location: string
  isTeam?: boolean
}

/**
 * Calculate suggested rate for influencer based on reach and location
 */
export function calcInfluencerRate({ reach, location, isTeam = false }: InfluencerRateParams): number {
  let base = 600

  // Reach-based pricing
  if (reach > 5000) base += 300
  if (reach > 10000) base += 500
  if (reach > 20000) base += 800

  // Premium location pricing
  const premiumZones = ['ทองหล่อ', 'RCA', 'ภูเก็ต', 'เอกมัย', 'ป่าตอง']
  if (premiumZones.includes(location)) {
    base += 200
  }

  // Team discount
  if (isTeam) {
    base *= 0.9 // 10% discount for team bookings
  }

  return Math.round(base)
}

/**
 * Calculate total job cost including platform commission
 */
export function calcJobCost(influencerRate: number, count: number = 1): {
  baseAmount: number
  commission: number
  total: number
} {
  const baseAmount = influencerRate * count
  const commission = Math.round(baseAmount * PLATFORM_COMMISSION)
  const total = baseAmount + commission

  return {
    baseAmount,
    commission,
    total,
  }
}

/**
 * Calculate withdrawal amount after fee
 */
export function calcWithdrawal(amount: number): {
  requestedAmount: number
  fee: number
  receivedAmount: number
} {
  const fee = Math.round(amount * WITHDRAWAL_FEE)
  const receivedAmount = amount - fee

  return {
    requestedAmount: amount,
    fee,
    receivedAmount,
  }
}

/**
 * Calculate team member payout after mom's commission
 */
export function calcTeamPayout(totalAmount: number, momCommission: number = 0.15): {
  momShare: number
  memberShare: number
} {
  const momShare = Math.round(totalAmount * momCommission)
  const memberShare = totalAmount - momShare

  return {
    momShare,
    memberShare,
  }
}

/**
 * Format Thai Baht currency
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Estimate job value for calculations
 */
export interface JobEstimate {
  cashAmount: number
  drinksValue: number
  totalValue: number
  platformFee: number
  barTotal: number
}

export function estimateJobValue(
  cashPerInfluencer: number,
  drinksValue: number,
  count: number
): JobEstimate {
  const cashAmount = cashPerInfluencer * count
  const totalDrinksValue = drinksValue * count
  const totalValue = cashAmount + totalDrinksValue
  const platformFee = Math.round(cashAmount * PLATFORM_COMMISSION)
  const barTotal = cashAmount + platformFee

  return {
    cashAmount,
    drinksValue: totalDrinksValue,
    totalValue,
    platformFee,
    barTotal,
  }
}

