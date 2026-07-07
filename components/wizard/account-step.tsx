"use client"

import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Eye, EyeOff, Sparkles } from "lucide-react"
import { formatGBP } from "@/lib/pricing"
import type { WizardState } from "./use-wizard-state"

export function AccountStep({
  wizard,
  showSuccess,
  submitError,
}: {
  wizard: WizardState
  showSuccess: boolean
  submitError: string
}) {
  const { form, errors, setField, price } = wizard
  const [showPassword, setShowPassword] = useState(false)

  if (showSuccess) {
    return (
      <div className="p-6">
        <Alert className="bg-primary/10 border-primary/20 shadow-subtle">
          <div className="flex flex-col items-center text-center py-6">
            <CheckCircle className="h-14 w-14 text-primary mb-4" />
            <AlertDescription className="text-[#121212] text-xl font-medium font-serif">
              You&rsquo;re on the pilot list!
            </AlertDescription>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-md">
              Your taste profile is saved and our curators are preparing your first selection. We&rsquo;ll email you as
              soon as your pilot box is confirmed — taking you to your dashboard now.
            </p>
          </div>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <Sparkles className="h-6 w-6 text-primary" />
          Join the Pilot
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Create your account to save your taste profile and reserve your place. No payment is taken during the
          pilot — we&rsquo;ll confirm details with you before your first box.
        </CardDescription>
      </div>

      <Card className="bg-primary/5 border-primary/20 shadow-subtle">
        <CardContent className="pt-8 pb-6 px-6">
          <h3 className="text-xl font-serif mb-6">Your Plan Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-base">
              <span>Membership:</span>
              <span>
                {form.subscriptionPlan} — {price.prints} {price.prints === 1 ? "print" : "prints"}/quarter
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span>Size preference:</span>
              <span>{form.sizePreference}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Frame Kit:</span>
              <span>{form.frameKit ? `${formatGBP(price.frameKitOneOff)} one-time` : "No"}</span>
            </div>
            <div className="flex justify-between text-base">
              <span>Originals early access:</span>
              <span>{form.originalsInterest ? "Yes" : "No"}</span>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Monthly price (inc VAT):</span>
              <span>{formatGBP(price.monthly)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 border p-6 rounded-lg shadow-subtle bg-white">
        <h3 className="font-serif text-xl">Create Your Account</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="your@email.com"
              className="h-12 rounded-sm shadow-subtle"
              aria-required="true"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-12 rounded-sm shadow-subtle pr-10"
                  aria-required="true"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                className="h-12 rounded-sm shadow-subtle"
                aria-required="true"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode" className="font-medium">
              Referral Code (Optional)
            </Label>
            <Input
              id="referralCode"
              value={form.referralCode}
              onChange={(e) => setField("referralCode", e.target.value)}
              placeholder="Enter code if you have one"
              className="h-12 rounded-sm shadow-subtle"
            />
          </div>
        </div>

        {submitError && (
          <Alert variant="destructive" className="rounded-lg shadow-subtle">
            <AlertDescription>
              {submitError}{" "}
              {submitError.includes("already exists") && (
                <Link href="/login" className="underline font-medium">
                  Log in instead
                </Link>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
