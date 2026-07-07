"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"
import { ART_STYLES, displayCredit, findStyle, findSubStyle } from "@/lib/art-data"
import { formatGBP } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

const nextSteps = [
  "Create your account and join the pilot",
  "Our curators match works from partner galleries to your taste profile",
  "Your first collection arrives rolled in a reusable tube within 7-10 business days",
  "Swap each quarter with a printer-free QR return — and buy any piece you love",
]

export function ReviewStep({ wizard }: { wizard: WizardState }) {
  const { form, price } = wizard

  // Preview the customer's own selections rather than stock imagery.
  const previewImages = (form.mainStyles.length > 0 ? form.mainStyles : ART_STYLES.slice(0, 3).map((s) => s.id))
    .slice(0, 3)
    .map((id) => findStyle(id)?.image)
    .filter((img): img is NonNullable<typeof img> => Boolean(img))

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <CheckCircle className="h-6 w-6 text-primary" />
          Review Your Selection
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Review your membership details before creating your account.
        </CardDescription>
      </div>

      <div className="grid gap-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewImages.map((image) => (
            <figure key={image.src} className="space-y-1.5">
              <div className="aspect-square relative bg-muted rounded-lg overflow-hidden shadow-subtle">
                <Image
                  src={image.src}
                  alt={`${image.title} by ${image.artist}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-[11px] text-muted-foreground">{displayCredit(image)}</figcaption>
            </figure>
          ))}
        </div>

        <Card className="shadow-subtle">
          <CardContent className="pt-8 pb-6 px-6">
            <h3 className="text-xl font-serif mb-6">Your Selections</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Art Preferences</h4>
                  <div className="flex flex-wrap gap-2">
                    {form.mainStyles.map((id) => (
                      <Badge key={id} variant="secondary" className="bg-white text-[#121212] shadow-subtle">
                        {findStyle(id)?.name ?? id}
                      </Badge>
                    ))}
                    {form.subStyles.map((id) => {
                      const match = findSubStyle(id)
                      return (
                        <Badge key={id} variant="outline" className="border-primary/30 text-primary">
                          {match ? `${match.style.name} · ${match.sub.name}` : id}
                        </Badge>
                      )
                    })}
                    {form.mainStyles.length === 0 && <span className="text-sm">None selected</span>}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Membership</h4>
                  <p className="font-medium font-serif">
                    {form.subscriptionPlan} — {price.prints} {price.prints === 1 ? "print" : "prints"} per quarter
                  </p>
                  <p className="text-sm">Billed monthly, prices include VAT</p>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Size Preference</h4>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {form.sizePreference}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Frame Kit</h4>
                  <p>{form.frameKit ? `Yes — ${formatGBP(price.frameKitOneOff)} one-time` : "No"}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Originals Early Access</h4>
                  <p>{form.originalsInterest ? "Yes — on the list" : "Not yet"}</p>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="bg-primary/5 p-6 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg">Monthly price (inc VAT):</span>
                  <span className="text-2xl font-bold font-serif">{formatGBP(price.monthly)}</span>
                </div>
                {form.frameKit && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>One-time Frame Kit at signup:</span>
                    <span>{formatGBP(price.frameKitOneOff)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 shadow-subtle">
          <h3 className="text-xl font-serif mb-4">What Happens Next?</h3>
          <ol className="space-y-3 mt-4">
            {nextSteps.map((step, index) => (
              <li key={step} className="flex items-start">
                <span className="bg-primary/20 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
