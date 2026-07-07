import { describe, it, expect } from "vitest"
import { calculatePrice, FRAME_KIT_PRICES, PLANS, VAT_RATE } from "@/lib/pricing"

describe("calculatePrice (Business Plan v3)", () => {
  it("prices plans at the VAT-inclusive business-plan tiers", () => {
    expect(PLANS.Basic.monthly).toBe(15)
    expect(PLANS.Standard.monthly).toBe(30)
    expect(PLANS.Premium.monthly).toBe(50)
    expect(calculatePrice({ subscriptionPlan: "Standard", frameKit: false }).monthly).toBe(30)
  })

  it("exposes net (ex-VAT) revenue for royalty maths", () => {
    const p = calculatePrice({ subscriptionPlan: "Standard", frameKit: false })
    expect(p.monthlyNet).toBeCloseTo(30 / (1 + VAT_RATE))
    expect(p.monthlyNet).toBeCloseTo(25)
  })

  it("maps prints per quarter to each plan", () => {
    expect(calculatePrice({ subscriptionPlan: "Basic", frameKit: false }).prints).toBe(1)
    expect(calculatePrice({ subscriptionPlan: "Standard", frameKit: false }).prints).toBe(3)
    expect(calculatePrice({ subscriptionPlan: "Premium", frameKit: false }).prints).toBe(5)
  })

  it("adds the one-time Frame Kit priced by rotation size", () => {
    expect(calculatePrice({ subscriptionPlan: "Basic", frameKit: true }).frameKitOneOff).toBe(FRAME_KIT_PRICES[1])
    expect(calculatePrice({ subscriptionPlan: "Standard", frameKit: true }).frameKitOneOff).toBe(79)
    expect(calculatePrice({ subscriptionPlan: "Premium", frameKit: true }).frameKitOneOff).toBe(119)
    expect(calculatePrice({ subscriptionPlan: "Standard", frameKit: false }).frameKitOneOff).toBe(0)
  })

  it("returns zero before a plan is chosen and rejects unknown plans", () => {
    expect(calculatePrice({ subscriptionPlan: "", frameKit: true }).monthly).toBe(0)
    expect(calculatePrice({ subscriptionPlan: "Custom", frameKit: false }).monthly).toBe(0)
  })
})
