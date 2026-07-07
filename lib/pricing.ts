// Pricing aligned to the Commercial Business Case (July 2026): consumer tiers
// £15 / £30 / £50 with a £33 blended target; custom plans capped so the wizard
// can never auto-quote warehouse-scale figures.

export const PLAN_PRICES = {
  Basic: 15,
  Standard: 30,
  Premium: 50,
  CUSTOM_PER_PIECE: 15,
} as const

export const CUSTOM_MAX_PIECES = 10
export const FRAME_MONTHLY_FEE = 12
export const YEARLY_DISCOUNT = 0.15

export const MULTIPLIERS = {
  artistTier: { Emerging: 1, "Mid-Career": 1.8, Established: 3.5 } as Record<string, number>,
  artType: { Print: 1, "Limited Edition Print": 2.5, Original: 8 } as Record<string, number>,
  size: { A4: 1, A3: 1.25, A2: 1.75, A1: 2.6, A0: 4.0 } as Record<string, number>,
}

export interface PricingInput {
  subscriptionPlan: string
  customPieces: number
  artistTier: string
  artType: string
  size: string
  frameCommitment: boolean
  billingCycle: "monthly" | "yearly"
}

export interface PriceBreakdown {
  base: number
  artistTier: number
  artType: number
  size: number
  frame: number
  discount: number
  total: number
}

export function clampCustomPieces(pieces: number): number {
  if (Number.isNaN(pieces)) return 1
  return Math.min(Math.max(Math.round(pieces), 1), CUSTOM_MAX_PIECES)
}

function basePrice(input: PricingInput): number {
  switch (input.subscriptionPlan) {
    case "Basic":
      return PLAN_PRICES.Basic
    case "Standard":
      return PLAN_PRICES.Standard
    case "Premium":
      return PLAN_PRICES.Premium
    case "Custom":
      return clampCustomPieces(input.customPieces) * PLAN_PRICES.CUSTOM_PER_PIECE
    default:
      return 0
  }
}

export function calculatePrice(input: PricingInput): PriceBreakdown {
  const base = basePrice(input)

  const tierMult = MULTIPLIERS.artistTier[input.artistTier] ?? 1
  const typeMult = MULTIPLIERS.artType[input.artType] ?? 1
  const sizeMult = MULTIPLIERS.size[input.size] ?? 1

  const artistTier = base * (tierMult - 1)
  const artType = (base + artistTier) * (typeMult - 1)
  const size = (base + artistTier + artType) * (sizeMult - 1)
  const frame = input.frameCommitment ? FRAME_MONTHLY_FEE : 0

  const subtotal = base + artistTier + artType + size + frame
  const discount = input.billingCycle === "yearly" ? subtotal * YEARLY_DISCOUNT : 0

  return {
    base,
    artistTier,
    artType,
    size,
    frame,
    discount,
    total: Math.max(Math.round(subtotal - discount), 0),
  }
}

export function formatGBP(amount: number): string {
  return `£${amount.toFixed(2)}`
}
