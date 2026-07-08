// Pricing aligned to the UK Business Plan v3: customer prices are VAT-inclusive,
// plans are flat monthly tiers (no per-option multipliers: galleries price
// buy-to-keep works themselves), and the Frame Kit is a one-time add-on.

export const VAT_RATE = 0.2

export const PLANS = {
  Basic: { monthly: 15, prints: 1 },
  Standard: { monthly: 30, prints: 3 },
  Premium: { monthly: 50, prints: 5 },
} as const

export type PlanName = keyof typeof PLANS

// One-time Frame Kit priced by the number of prints in the member's rotation.
export const FRAME_KIT_PRICES: Record<number, number> = {
  1: 35,
  3: 79,
  5: 119,
}

export interface PricingInput {
  subscriptionPlan: string
  frameKit: boolean
}

export interface PriceBreakdown {
  monthly: number // inc VAT
  monthlyNet: number // ex VAT: what royalties are calculated on
  frameKitOneOff: number // inc VAT, charged once at signup
  prints: number
}

export function isPlan(name: string): name is PlanName {
  return name in PLANS
}

export function calculatePrice(input: PricingInput): PriceBreakdown {
  if (!isPlan(input.subscriptionPlan)) {
    return { monthly: 0, monthlyNet: 0, frameKitOneOff: 0, prints: 0 }
  }
  const plan = PLANS[input.subscriptionPlan]
  return {
    monthly: plan.monthly,
    monthlyNet: plan.monthly / (1 + VAT_RATE),
    frameKitOneOff: input.frameKit ? (FRAME_KIT_PRICES[plan.prints] ?? 0) : 0,
    prints: plan.prints,
  }
}

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`
}
