"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Frame } from "lucide-react"
import { findStyle } from "@/lib/art-data"
import { formatGBP, FRAME_MONTHLY_FEE, MULTIPLIERS } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

const tierOptions = [
  { value: "Emerging", blurb: "New talent with fresh perspectives" },
  { value: "Mid-Career", blurb: "Established with growing recognition" },
  { value: "Established", blurb: "Renowned artists with significant impact" },
]

const typeOptions = [
  { value: "Print", label: "Print", blurb: "High-quality reproduction" },
  { value: "Limited Edition Print", label: "Limited Edition", blurb: "Numbered and signed by the artist" },
  { value: "Original", label: "Original", blurb: "One-of-a-kind original artwork" },
]

const sizeOptions = [
  { value: "A4", dims: "21.0 × 29.7 cm" },
  { value: "A3", dims: "29.7 × 42.0 cm" },
  { value: "A2", dims: "42.0 × 59.4 cm" },
  { value: "A1", dims: "59.4 × 84.1 cm" },
  { value: "A0", dims: "84.1 × 118.9 cm" },
]

const multiplierBadge = (mult: number) => (mult === 1 ? "Base Price" : `${mult}x Multiplier`)

export function CustomiseStep({ wizard }: { wizard: WizardState }) {
  const { form, setField, price } = wizard
  const previewImage = (form.mainStyles.length > 0 && findStyle(form.mainStyles[0])?.image) || findStyle("abstract")!.image

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <Frame className="h-6 w-6 text-primary" />
          Customisation
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Customise your artwork features to match your preferences and space.
        </CardDescription>
      </div>

      <div className="grid gap-8 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <Label className="text-lg font-medium">Artist Tier</Label>
              <RadioGroup
                value={form.artistTier}
                onValueChange={(value) => setField("artistTier", value)}
                className="grid grid-cols-1 gap-4"
              >
                {tierOptions.map(({ value, blurb }) => (
                  <div
                    key={value}
                    className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${
                      form.artistTier === value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={value} id={`tier-${value}`} className="sr-only" />
                    <Label htmlFor={`tier-${value}`} className="font-medium font-serif text-lg cursor-pointer">
                      {value}
                    </Label>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{blurb}</p>
                    <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                      {multiplierBadge(MULTIPLIERS.artistTier[value])}
                    </Badge>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <Label className="text-lg font-medium">Art Type</Label>
              <RadioGroup
                value={form.artType}
                onValueChange={(value) => setField("artType", value)}
                className="grid grid-cols-1 gap-4"
              >
                {typeOptions.map(({ value, label, blurb }) => (
                  <div
                    key={value}
                    className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${
                      form.artType === value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={value} id={`type-${value}`} className="sr-only" />
                    <Label htmlFor={`type-${value}`} className="font-medium font-serif text-lg cursor-pointer">
                      {label}
                    </Label>
                    <p className="text-muted-foreground mt-2 leading-relaxed">{blurb}</p>
                    <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                      {multiplierBadge(MULTIPLIERS.artType[value])}
                    </Badge>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <div className="sticky top-6">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-muted shadow-subtle mb-6">
                <Image
                  src={previewImage.src}
                  alt={`${previewImage.title} by ${previewImage.artist}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-lg shadow-subtle text-center">
                    <p className="font-serif text-lg mb-2">Preview</p>
                    <p className="text-sm text-muted-foreground">
                      {form.artistTier} Artist • {form.artType} • {form.size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium">Size</Label>
                <RadioGroup
                  value={form.size}
                  onValueChange={(value) => setField("size", value)}
                  className="grid grid-cols-2 gap-4"
                >
                  {sizeOptions.map(({ value, dims }) => (
                    <div
                      key={value}
                      className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${
                        form.size === value ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={value} id={`size-${value}`} className="sr-only" />
                      <Label htmlFor={`size-${value}`} className="font-medium font-serif text-lg cursor-pointer">
                        {value}
                      </Label>
                      <p className="text-muted-foreground mt-2 leading-relaxed">{dims}</p>
                      <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                        {multiplierBadge(MULTIPLIERS.size[value])}
                      </Badge>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="flex items-center space-x-3 p-6 rounded-lg border shadow-subtle">
          <Checkbox
            id="frameCommitment"
            checked={form.frameCommitment}
            onCheckedChange={(checked) => setField("frameCommitment", checked === true)}
            className="text-primary border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
          <div className="space-y-2">
            <Label htmlFor="frameCommitment" className="font-medium font-serif text-lg">
              Include premium frames with artwork
            </Label>
            <p className="text-muted-foreground leading-relaxed">
              Add £{FRAME_MONTHLY_FEE} per month for professionally framed artwork
            </p>
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20 shadow-subtle mt-4">
          <CardContent className="pt-8 pb-6 px-6">
            <h3 className="text-xl font-serif mb-6">Price Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-base">
                <span>Base Price:</span>
                <span>{formatGBP(price.base)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Artist Tier ({form.artistTier}):</span>
                <span>+{formatGBP(price.artistTier)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Art Type ({form.artType}):</span>
                <span>+{formatGBP(price.artType)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Size ({form.size}):</span>
                <span>+{formatGBP(price.size)}</span>
              </div>
              {form.frameCommitment && (
                <div className="flex justify-between text-base">
                  <span>Premium Frames:</span>
                  <span>+{formatGBP(price.frame)}</span>
                </div>
              )}
              {form.billingCycle === "yearly" && (
                <div className="flex justify-between text-base text-green-600">
                  <span>Annual Discount (15%):</span>
                  <span>-{formatGBP(price.discount)}</span>
                </div>
              )}
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total {form.billingCycle === "yearly" ? "Monthly " : ""}Price:</span>
                <span>{formatGBP(price.total)}</span>
              </div>
              {form.billingCycle === "yearly" && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Annual payment:</span>
                  <span>{formatGBP(price.total * 12)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
