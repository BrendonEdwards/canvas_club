"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Frame,
  Home,
  Loader2,
  Palette,
  Sparkles,
  Star,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { TOTAL_STEPS, useWizardState, WIZARD_STEPS } from "@/components/wizard/use-wizard-state"
import { IntroStep } from "@/components/wizard/intro-step"
import { StylesStep } from "@/components/wizard/styles-step"
import { RatingsStep } from "@/components/wizard/ratings-step"
import { PlanStep } from "@/components/wizard/plan-step"
import { ExtrasStep } from "@/components/wizard/extras-step"
import { ReviewStep } from "@/components/wizard/review-step"
import { AccountStep } from "@/components/wizard/account-step"

const stepIcons = [Home, Palette, Star, CreditCard, Frame, CheckCircle, Sparkles]

export default function ArtSubscription() {
  const router = useRouter()
  const { refresh } = useAuth()
  const wizard = useWizardState()

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const goTo = (step: number) => {
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }

  const handleNext = () => {
    if (currentStep === 0 || wizard.validateStep(currentStep)) {
      goTo(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    if (!wizard.validateStep(currentStep)) return
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizard.registrationPayload()),
      })
      if (res.ok) {
        await refresh()
        setShowSuccess(true)
        setTimeout(() => router.push("/dashboard?welcome=1"), 2500)
      } else {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data.error ?? "Registration failed. Please try again.")
        setIsSubmitting(false)
      }
    } catch {
      setSubmitError("Network error. Please try again.")
      setIsSubmitting(false)
    }
  }

  const stepStatus = (step: number) => {
    if (step === currentStep) return "current"
    return step < currentStep ? "complete" : "upcoming"
  }

  const renderStep = () => {
    switch (WIZARD_STEPS[currentStep]) {
      case "Intro":
        return <IntroStep />
      case "Styles":
        return <StylesStep wizard={wizard} />
      case "Ratings":
        return <RatingsStep wizard={wizard} />
      case "Plan":
        return <PlanStep wizard={wizard} />
      case "Extras":
        return <ExtrasStep wizard={wizard} />
      case "Review":
        return <ReviewStep wizard={wizard} />
      case "Account":
        return <AccountStep wizard={wizard} showSuccess={showSuccess} submitError={submitError} />
      default:
        return null
    }
  }

  const isLastStep = currentStep === TOTAL_STEPS - 1
  const nextDisabled = WIZARD_STEPS[currentStep] === "Ratings" && !wizard.ratingComplete

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-6">
      <Card className="w-full max-w-4xl shadow-subtle rounded-lg overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">Canvas Club</h2>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div className="flex justify-between mt-4">
            {WIZARD_STEPS.map((name, index) => {
              const status = stepStatus(index)
              const Icon = stepIcons[index]
              return (
                <div
                  key={name}
                  className={`flex flex-col items-center ${
                    status === "current"
                      ? "text-primary"
                      : status === "complete"
                        ? "text-primary/70"
                        : "text-muted-foreground"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => index < currentStep && goTo(index)}
                    disabled={index > currentStep || showSuccess}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs transition-all ${
                      status === "current"
                        ? "bg-primary text-primary-foreground"
                        : status === "complete"
                          ? "bg-primary/20 hover:bg-primary/30"
                          : "bg-muted cursor-not-allowed"
                    }`}
                    aria-label={`Go to step ${index + 1}: ${name}`}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                  <span className="text-xs mt-2 hidden md:inline font-medium">{name}</span>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0">{renderStep()}</CardContent>

        <CardFooter className="flex justify-between p-6">
          {currentStep > 0 && !showSuccess && (
            <Button
              variant="outline"
              onClick={() => goTo(currentStep - 1)}
              className="flex items-center gap-2 rounded-sm border-primary/30 text-primary hover:bg-primary/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {!isLastStep ? (
            <Button
              onClick={handleNext}
              disabled={nextDisabled}
              className={`flex items-center gap-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${
                currentStep > 0 ? "ml-auto" : ""
              } ${nextDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {currentStep === 0 ? "Get Started" : nextDisabled ? "Rate every artwork to continue" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            !showSuccess && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Join the Pilot
                    <Sparkles className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
