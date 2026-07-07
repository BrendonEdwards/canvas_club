"use client"

import { useMemo, useState } from "react"
import { calculatePrice, clampCustomPieces, type PriceBreakdown } from "@/lib/pricing"
import { findSubStyle, RATING_DECK } from "@/lib/art-data"
import type { Rating } from "@/lib/types"

export interface WizardForm {
  mainStyles: string[]
  subStyles: string[]
  ratings: Record<string, Rating>
  subscriptionPlan: string
  customPieces: number
  artistTier: string
  artType: string
  size: string
  frameCommitment: boolean
  billingCycle: "monthly" | "yearly"
  email: string
  password: string
  confirmPassword: string
  referralCode: string
}

export type WizardErrors = Partial<Record<string, string>>

export const WIZARD_STEPS = ["Intro", "Styles", "Ratings", "Plan", "Customise", "Review", "Account"] as const
export const TOTAL_STEPS = WIZARD_STEPS.length

const initialForm: WizardForm = {
  mainStyles: [],
  subStyles: [],
  ratings: {},
  subscriptionPlan: "",
  customPieces: 1,
  artistTier: "Emerging",
  artType: "Print",
  size: "A4",
  frameCommitment: false,
  billingCycle: "monthly",
  email: "",
  password: "",
  confirmPassword: "",
  referralCode: "",
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function useWizardState() {
  const [form, setForm] = useState<WizardForm>(initialForm)
  const [errors, setErrors] = useState<WizardErrors>({})
  const [ratingOrder, setRatingOrder] = useState<string[]>([])

  const price: PriceBreakdown = useMemo(() => calculatePrice(form), [form])

  const clearError = (field: string) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))

  const setField = <K extends keyof WizardForm>(field: K, value: WizardForm[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: field === "customPieces" ? clampCustomPieces(value as number) : value,
    }))
    clearError(field)
  }

  const toggleStyle = (styleId: string) => {
    setForm((prev) => ({ ...prev, mainStyles: toggle(prev.mainStyles, styleId) }))
    clearError("mainStyles")
  }

  // Selecting a sub-genre implies interest in its parent style.
  const toggleSubStyle = (subStyleId: string) => {
    setForm((prev) => {
      const subStyles = toggle(prev.subStyles, subStyleId)
      const parent = findSubStyle(subStyleId)?.style.id
      const addingParent =
        subStyles.includes(subStyleId) && parent && !prev.mainStyles.includes(parent)
      return {
        ...prev,
        subStyles,
        mainStyles: addingParent ? [...prev.mainStyles, parent] : prev.mainStyles,
      }
    })
    clearError("mainStyles")
  }

  const rate = (artworkId: string, rating: Rating) => {
    setForm((prev) => ({ ...prev, ratings: { ...prev.ratings, [artworkId]: rating } }))
    setRatingOrder((prev) => [...prev.filter((id) => id !== artworkId), artworkId])
    clearError("ratings")
  }

  const undoRate = () => {
    setRatingOrder((prev) => {
      const last = prev[prev.length - 1]
      if (!last) return prev
      setForm((f) => {
        const ratings = { ...f.ratings }
        delete ratings[last]
        return { ...f, ratings }
      })
      return prev.slice(0, -1)
    })
  }

  const ratedCount = Object.keys(form.ratings).length
  const ratingComplete = ratedCount >= RATING_DECK.length

  const validateStep = (step: number): boolean => {
    const next: WizardErrors = {}
    switch (WIZARD_STEPS[step]) {
      case "Styles":
        if (form.mainStyles.length === 0) next.mainStyles = "Please select at least one art style"
        break
      case "Ratings":
        if (!ratingComplete) next.ratings = "Please rate every artwork so we can learn your taste"
        break
      case "Plan":
        if (!form.subscriptionPlan) next.subscriptionPlan = "Please select a subscription plan"
        break
      case "Account":
        if (!form.email) next.email = "Please enter your email address"
        else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Please enter a valid email address"
        if (!form.password) next.password = "Please create a password"
        else if (form.password.length < 6) next.password = "Password must be at least 6 characters"
        if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match"
        break
      default:
        break
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const registrationPayload = () => ({
    email: form.email,
    password: form.password,
    name: form.email.split("@")[0],
    preferences: {
      mainStyles: form.mainStyles,
      subStyles: form.subStyles,
      ratings: form.ratings,
    },
    subscription: {
      plan: form.subscriptionPlan,
      customPieces: form.subscriptionPlan === "Custom" ? form.customPieces : undefined,
      artistTier: form.artistTier,
      artType: form.artType,
      size: form.size,
      frameCommitment: form.frameCommitment,
      billingCycle: form.billingCycle,
      monthlyPrice: price.total,
    },
  })

  return {
    form,
    errors,
    setErrors,
    setField,
    toggleStyle,
    toggleSubStyle,
    rate,
    undoRate,
    ratingOrder,
    ratedCount,
    ratingComplete,
    validateStep,
    price,
    registrationPayload,
  }
}

export type WizardState = ReturnType<typeof useWizardState>
