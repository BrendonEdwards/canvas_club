import { describe, it, expect } from "vitest"
import { calculatePrice, clampCustomPieces, CUSTOM_MAX_PIECES, PLAN_PRICES } from "@/lib/pricing"

const base = {
  subscriptionPlan: "Basic",
  customPieces: 1,
  artistTier: "Emerging",
  artType: "Print",
  size: "A4",
  frameCommitment: false,
  billingCycle: "monthly" as const,
}

describe("calculatePrice", () => {
  it("prices Basic monthly at the business-case £15", () => {
    expect(PLAN_PRICES.Basic).toBe(15)
    expect(calculatePrice(base).total).toBe(15)
  })

  it("prices Standard and Premium at £30 and £50", () => {
    expect(calculatePrice({ ...base, subscriptionPlan: "Standard" }).total).toBe(30)
    expect(calculatePrice({ ...base, subscriptionPlan: "Premium" }).total).toBe(50)
  })

  it("chains multipliers like the original formula", () => {
    const p = calculatePrice({
      ...base,
      subscriptionPlan: "Standard",
      artistTier: "Mid-Career",
      artType: "Limited Edition Print",
      size: "A3",
    })
    expect(p.base).toBe(30)
    expect(p.artistTier).toBeCloseTo(24)
    expect(p.artType).toBeCloseTo(81)
    expect(p.size).toBeCloseTo(33.75)
    expect(p.total).toBe(169)
  })

  it("applies frame fee and 15% yearly discount", () => {
    const p = calculatePrice({
      ...base,
      subscriptionPlan: "Standard",
      frameCommitment: true,
      billingCycle: "yearly",
    })
    expect(p.frame).toBe(12)
    expect(p.discount).toBeCloseTo(6.3)
    expect(p.total).toBe(36)
  })

  it("caps custom plans at 10 pieces of £15", () => {
    expect(CUSTOM_MAX_PIECES).toBe(10)
    expect(clampCustomPieces(99)).toBe(10)
    expect(clampCustomPieces(0)).toBe(1)
    expect(clampCustomPieces(Number.NaN)).toBe(1)
    expect(calculatePrice({ ...base, subscriptionPlan: "Custom", customPieces: 10 }).total).toBe(150)
    expect(calculatePrice({ ...base, subscriptionPlan: "Custom", customPieces: 99 }).total).toBe(150)
  })

  it("returns zero before a plan is chosen", () => {
    expect(calculatePrice({ ...base, subscriptionPlan: "" }).total).toBe(0)
  })
})
