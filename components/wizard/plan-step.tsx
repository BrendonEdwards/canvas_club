"use client"

import { Badge } from "@/components/ui/badge"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard } from "lucide-react"
import { PLANS } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

const plans = [
  {
    id: "Basic" as const,
    tagline: "Perfect for first-time collectors",
    features: ["1 print per quarter", "Emerging artists", "A3 and A2 formats"],
  },
  {
    id: "Standard" as const,
    tagline: "Our most popular plan",
    popular: true,
    features: ["3 prints per quarter", "Emerging and mid-career artists", "Curated as a coherent collection"],
  },
  {
    id: "Premium" as const,
    tagline: "For serious art lovers",
    features: [
      "5 prints per quarter",
      "Access to limited editions and established artists",
      "Priority access to the Originals pilot",
    ],
  },
]

export function PlanStep({ wizard }: { wizard: WizardState }) {
  const { form, errors, setField } = wizard

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <CreditCard className="h-6 w-6 text-primary" />
          Membership Plan
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Choose the plan that fits your walls. All prices include VAT: no payment is taken during the pilot.
        </CardDescription>
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
                £{PLANS[plan.id].monthly}/month inc VAT: {plan.tagline}
              </p>
              <ul className="text-sm mt-4 space-y-2 leading-relaxed">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </RadioGroup>

      {errors.subscriptionPlan && <p className="text-sm text-red-500 mt-2">{errors.subscriptionPlan}</p>}
    </div>
  )
}
