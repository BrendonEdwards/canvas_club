"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { CreditCard } from "lucide-react"
import { CUSTOM_MAX_PIECES, PLAN_PRICES, YEARLY_DISCOUNT } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

const yearlyMonthly = (monthly: number) => Math.round(monthly * 12 * (1 - YEARLY_DISCOUNT)) / 12

const plans = [
  {
    id: "Basic",
    price: PLAN_PRICES.Basic,
    tagline: "Perfect for beginners",
    features: ["1 artwork per quarter", "Emerging artists only", "Print quality only"],
  },
  {
    id: "Standard",
    price: PLAN_PRICES.Standard,
    tagline: "Our most popular plan",
    popular: true,
    features: ["3 artworks per quarter", "Emerging and Mid-Career artists", "Print and Limited Edition options"],
  },
  {
    id: "Premium",
    price: PLAN_PRICES.Premium,
    tagline: "For serious collectors",
    features: ["5 artworks per quarter", "Access to all artist tiers", "All art types including Originals"],
  },
]

export function PlanStep({ wizard }: { wizard: WizardState }) {
  const { form, errors, setField } = wizard
  const yearly = form.billingCycle === "yearly"

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <CreditCard className="h-6 w-6 text-primary" />
          Subscription Plan
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Choose a subscription plan that fits your art collection goals.
        </CardDescription>
      </div>

      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className={!yearly ? "font-medium" : "text-muted-foreground"}>Monthly</span>
        <Switch
          checked={yearly}
          onCheckedChange={(checked) => setField("billingCycle", checked ? "yearly" : "monthly")}
          aria-label="Toggle between monthly and yearly billing"
        />
        <span className={yearly ? "font-medium" : "text-muted-foreground"}>
          Yearly <Badge className="ml-1 bg-primary/20 text-primary">Save 15%</Badge>
        </span>
      </div>

      <RadioGroup
        value={form.subscriptionPlan}
        onValueChange={(value) => setField("subscriptionPlan", value)}
        className="space-y-4 mt-6"
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${
              form.subscriptionPlan === plan.id ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="text-primary border-primary/50" />
            <div className="flex flex-col">
              <div className="flex items-center">
                <Label htmlFor={`plan-${plan.id}`} className="font-medium font-serif text-lg">
                  {plan.id}
                </Label>
                {plan.popular && <Badge className="ml-2 bg-primary/20 text-primary">Most Popular</Badge>}
              </div>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                £{yearly ? yearlyMonthly(plan.price) : plan.price}/month — {plan.tagline}
              </p>
              <ul className="text-sm mt-4 space-y-2 leading-relaxed">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div
          className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${
            form.subscriptionPlan === "Custom" ? "border-primary bg-primary/5" : "border-border"
          }`}
        >
          <RadioGroupItem value="Custom" id="plan-custom" className="text-primary border-primary/50" />
          <div className="flex flex-col w-full">
            <Label htmlFor="plan-custom" className="font-medium font-serif text-lg">
              Custom
            </Label>
            <p className="text-muted-foreground mt-1 leading-relaxed">
              £{yearly ? yearlyMonthly(PLAN_PRICES.CUSTOM_PER_PIECE) : PLAN_PRICES.CUSTOM_PER_PIECE} per
              piece/month — build your own quarterly collection
            </p>

            {form.subscriptionPlan === "Custom" && (
              <div className="mt-6 w-full max-w-xs">
                <Label htmlFor="customPieces" className="text-sm">
                  Number of pieces per month (1–{CUSTOM_MAX_PIECES})
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-sm border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => setField("customPieces", form.customPieces - 1)}
                    disabled={form.customPieces <= 1}
                    aria-label="Decrease number of pieces"
                  >
                    -
                  </Button>
                  <Input
                    id="customPieces"
                    type="number"
                    min={1}
                    max={CUSTOM_MAX_PIECES}
                    value={form.customPieces}
                    onChange={(e) => setField("customPieces", Number.parseInt(e.target.value, 10))}
                    className="text-center h-10 rounded-sm shadow-subtle"
                    aria-label="Number of pieces per month"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-sm border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => setField("customPieces", form.customPieces + 1)}
                    disabled={form.customPieces >= CUSTOM_MAX_PIECES}
                    aria-label="Increase number of pieces"
                  >
                    +
                  </Button>
                </div>

                <p className="text-sm font-medium mt-4">
                  Total: £
                  {yearly
                    ? yearlyMonthly(form.customPieces * PLAN_PRICES.CUSTOM_PER_PIECE)
                    : form.customPieces * PLAN_PRICES.CUSTOM_PER_PIECE}
                  /month
                </p>
              </div>
            )}
          </div>
        </div>
      </RadioGroup>

      {errors.subscriptionPlan && <p className="text-sm text-red-500 mt-2">{errors.subscriptionPlan}</p>}
    </div>
  )
}
