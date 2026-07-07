"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Frame, Sparkles } from "lucide-react"
import { formatGBP, FRAME_KIT_PRICES, PLANS, isPlan } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

const sizeOptions = [
  { value: "A3", label: "A3", blurb: "29.7 × 42.0 cm — desks, shelves and smaller walls" },
  { value: "A2", label: "A2", blurb: "42.0 × 59.4 cm — a statement above furniture" },
  { value: "Mixed", label: "Mixed", blurb: "Let our curators vary sizes across your collection" },
]

export function ExtrasStep({ wizard }: { wizard: WizardState }) {
  const { form, setField, price } = wizard
  const prints = isPlan(form.subscriptionPlan) ? PLANS[form.subscriptionPlan].prints : 3
  const kitPrice = FRAME_KIT_PRICES[prints] ?? FRAME_KIT_PRICES[3]

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <Frame className="h-6 w-6 text-primary" />
          Make It Yours
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Choose your preferred print size and how you&rsquo;d like your art to hang.
        </CardDescription>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-medium">Preferred size</Label>
        <RadioGroup
          value={form.sizePreference}
          onValueChange={(value) => setField("sizePreference", value)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {sizeOptions.map(({ value, label, blurb }) => (
            <div
              key={value}
              className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${
                form.sizePreference === value ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <RadioGroupItem value={value} id={`size-${value}`} className="sr-only" />
              <Label htmlFor={`size-${value}`} className="font-medium font-serif text-lg cursor-pointer">
                {label}
              </Label>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{blurb}</p>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground">
          Size preference guides curation — it doesn&rsquo;t change your monthly price.
        </p>
      </div>

      <Separator />

      {/* Frame Kit */}
      <div
        className={`flex items-start space-x-3 p-6 rounded-lg border transition-all shadow-subtle ${
          form.frameKit ? "border-primary bg-primary/5" : ""
        }`}
      >
        <Checkbox
          id="frameKit"
          checked={form.frameKit}
          onCheckedChange={(checked) => setField("frameKit", checked === true)}
          className="mt-1 text-primary border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="space-y-2">
          <Label htmlFor="frameKit" className="font-medium font-serif text-lg cursor-pointer">
            Add the Canvas Club Frame Kit —{" "}
            <span className="whitespace-nowrap">{formatGBP(kitPrice)} one-time</span>
          </Label>
          <p className="text-muted-foreground leading-relaxed">
            {prints} quick-swap {prints === 1 ? "frame" : "frames"} that you keep. Each rotation becomes a
            60-second swap — no framing shop, no tools. Prints arrive rolled in our reusable tube and slot
            straight in.
          </p>
          <Badge variant="outline" className="border-primary/30 text-primary">
            One-time purchase · yours to keep
          </Badge>
        </div>
      </div>

      {/* Originals pipeline */}
      <div
        className={`flex items-start space-x-3 p-6 rounded-lg border transition-all shadow-subtle ${
          form.originalsInterest ? "border-primary bg-primary/5" : ""
        }`}
      >
        <Checkbox
          id="originalsInterest"
          checked={form.originalsInterest}
          onCheckedChange={(checked) => setField("originalsInterest", checked === true)}
          className="mt-1 text-primary border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
        <div className="space-y-2">
          <Label htmlFor="originalsInterest" className="font-medium font-serif text-lg cursor-pointer">
            <Sparkles className="inline h-4 w-4 text-primary mr-1" />
            Originals are coming — keep me on the early-access list
          </Label>
          <p className="text-muted-foreground leading-relaxed">
            We&rsquo;re working with our partner galleries to bring original works into rotation for members.
            No commitment — we&rsquo;ll simply let you know first.
          </p>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-primary/5 border-primary/20 shadow-subtle">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span>Membership ({form.subscriptionPlan || "no plan selected"}):</span>
              <span>{formatGBP(price.monthly)}/month inc VAT</span>
            </div>
            {form.frameKit && (
              <div className="flex justify-between text-base">
                <span>Frame Kit (one-time):</span>
                <span>{formatGBP(price.frameKitOneOff)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
