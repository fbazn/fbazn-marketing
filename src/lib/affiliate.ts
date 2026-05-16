// Commission rates (as decimals)
export const BASE_RATE = 0.20

export function getTierBoost(rank: number): number {
  if (rank <= 3) return 0.05
  if (rank <= 5) return 0.025
  if (rank <= 10) return 0.01
  return 0
}

export function getEffectiveRate(rank: number): number {
  return BASE_RATE + getTierBoost(rank)
}

export function getPlanAmount(plan: string): number {
  const amounts: Record<string, number> = {
    starter: 10,
    pro: 25,
    business: 49,
  }
  return amounts[plan] ?? 0
}

// Returns the payout date (15th of the following month) for a given referral date
export function getPayoutDate(referralMonth: Date): Date {
  const d = new Date(referralMonth)
  d.setMonth(d.getMonth() + 1)
  d.setDate(15)
  return d
}

// Slugify a referral code: strip non-alphanumeric, uppercase, max 10 chars
export function sanitiseCode(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10)
}

export const HOLD_DAYS = 7
export const ATTRIBUTION_DAYS = 30
export const MAX_COMMISSION_MONTHS = 12
export const MIN_PAYOUT_GBP = 20
