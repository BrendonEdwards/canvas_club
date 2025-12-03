"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  Palette,
  CreditCard,
  Frame,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Home,
  Users,
  ChevronDown,
  ChevronUp,
  Eye,
  Gift,
  CreditCardIcon,
  Apple,
  ShoppingCartIcon as Paypal,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { StyleSelector } from "@/components/StyleSelector"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function ArtSubscription() {
  const router = useRouter()
  const { login } = useAuth()

  // State for current step
  const [currentStep, setCurrentStep] = useState(0)

  // State for form data
  const [formData, setFormData] = useState({
    artStyles: [],
    subStyles: [],
    subscriptionPlan: "",
    customPieces: "1",
    artistTier: "Emerging",
    artType: "Print",
    size: "A4",
    frameCommitment: false,
    billingCycle: "monthly",
    paymentMethod: "card",
    savePaymentInfo: false,
    email: "",
    password: "", // Added password field
    referralCode: "",
  })

  // State for validation errors
  const [errors, setErrors] = useState({})

  // State for loading on final step
  const [isLoading, setIsLoading] = useState(false)

  // State for success message
  const [showSuccess, setShowSuccess] = useState(false)

  // State for price breakdown
  const [priceBreakdown, setPriceBreakdown] = useState({
    base: 0,
    artistTier: 0,
    artType: 0,
    size: 0,
    frame: 0,
    discount: 0,
    total: 0,
  })

  // State for summary visibility
  const [showSummary, setShowSummary] = useState(false)

  // Ref for form element to enable keyboard navigation
  const formRef = useRef(null)

  // Price multipliers
  const priceMultipliers = {
    artistTier: {
      Emerging: 1,
      "Mid-Career": 1.8,
      Established: 3.5,
    },
    artType: {
      Print: 1,
      "Limited Edition Print": 2.5,
      Original: 8,
    },
    size: {
      A4: 1,
      A3: 1.25,
      A2: 1.75,
      A1: 2.6,
      A0: 4.0,
    },
  }

  // Calculate final price based on selections
  const calculatePrice = () => {
    let basePrice = 0

    // Base subscription price
    switch (formData.subscriptionPlan) {
      case "Basic":
        basePrice = 10
        break
      case "Standard":
        basePrice = 25
        break
      case "Premium":
        basePrice = 40
        break
      case "Custom":
        basePrice = Number.parseInt(formData.customPieces) * 10
        break
      default:
        basePrice = 0
    }

    // Apply multipliers
    const artistTierMultiplier = priceMultipliers.artistTier[formData.artistTier] || 1
    const artTypeMultiplier = priceMultipliers.artType[formData.artType] || 1
    const sizeMultiplier = priceMultipliers.size[formData.size] || 1

    // Calculate component prices
    const artistTierPrice = basePrice * (artistTierMultiplier - 1)
    const artTypePrice = (basePrice + artistTierPrice) * (artTypeMultiplier - 1)
    const sizePrice = (basePrice + artistTierPrice + artTypePrice) * (sizeMultiplier - 1)

    // Frame commitment cost
    const framePrice = formData.frameCommitment ? 12 : 0

    // Calculate discount for annual billing
    const subtotal = basePrice + artistTierPrice + artTypePrice + sizePrice + framePrice
    const discount = formData.billingCycle === "yearly" ? subtotal * 0.15 : 0

    // Calculate total
    const total = subtotal - discount

    // Return the breakdown without setting state
    return {
      base: basePrice,
      artistTier: artistTierPrice,
      artType: artTypePrice,
      size: sizePrice,
      frame: framePrice,
      discount: discount,
      total: Math.max(Math.round(total), 0),
    }
  }

  // Update price when form data changes
  useEffect(() => {
    const priceData = calculatePrice()
    setPriceBreakdown(priceData)
  }, [formData])

  // Handle form field changes
  const handleChange = (field, value) => {
    if (field === "artStyles") {
      // Toggle the art style in the array
      const updatedStyles = [...formData.artStyles]
      const index = updatedStyles.indexOf(value)

      if (index === -1) {
        updatedStyles.push(value)
      } else {
        updatedStyles.splice(index, 1)
      }

      setFormData({
        ...formData,
        artStyles: updatedStyles,
      })
    } else if (field === "subStyles") {
      // Toggle the sub style in the array
      const updatedSubStyles = [...formData.subStyles]
      const index = updatedSubStyles.indexOf(value)

      if (index === -1) {
        updatedSubStyles.push(value)
      } else {
        updatedSubStyles.splice(index, 1)
      }

      setFormData({
        ...formData,
        subStyles: updatedSubStyles,
      })
    } else {
      // Handle other fields normally
      setFormData({
        ...formData,
        [field]: value,
      })
    }

    // Clear error for this field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      })
    }
  }

  // Validate current step
  const validateStep = () => {
    const newErrors = {}

    switch (currentStep) {
      case 1:
        if (!formData.artStyles.length) {
          newErrors.artStyles = "Please select at least one art style"
        }
        break
      case 2: // Plan (was 3)
        if (!formData.subscriptionPlan) {
          newErrors.subscriptionPlan = "Please select a subscription plan"
        }
        if (formData.subscriptionPlan === "Custom") {
          const pieces = Number.parseInt(formData.customPieces)
          if (isNaN(pieces) || pieces < 1 || pieces > 300) {
            newErrors.customPieces = "Please enter between 1-30 pieces"
          }
        }
        break
      case 5: // Checkout (was 6)
        if (!formData.email) {
          newErrors.email = "Please enter your email address"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
        if (!formData.password) {
            newErrors.password = "Please create a password"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next button click
  const handleNext = () => {
    if (currentStep === 0 || validateStep()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  // Handle back button click
  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Handle direct navigation to a step
  const handleStepClick = (step) => {
    if (step < currentStep) {
      setCurrentStep(step)
      window.scrollTo(0, 0)
    }
  }

  // Handle submit
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsLoading(true)

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.email.split('@')[0],
            preferences: {
              mainStyles: formData.artStyles,
              subStyles: formData.subStyles,
              ratings: {} // Removed ratings
            },
            subscription: {
              plan: formData.subscriptionPlan,
              piecesPerQuarter: formData.subscriptionPlan === 'Basic' ? 1 : formData.subscriptionPlan === 'Standard' ? 3 : 5,
              price: priceBreakdown.total,
              billingCycle: formData.billingCycle,
              artistTier: formData.artistTier,
              artType: formData.artType,
              size: formData.size,
              frameCommitment: formData.frameCommitment
            }
          })
        })

        if (res.ok) {
           const user = await res.json()
           login(user.email)
           setIsLoading(false)
           setShowSuccess(true)
           // Redirect to dashboard after short delay
           setTimeout(() => {
             router.push('/dashboard')
           }, 3000)
        } else {
           setIsLoading(false)
           // Handle error (e.g. user exists)
           const data = await res.json()
           setErrors({ ...errors, email: data.error || 'Registration failed' })
        }
      } catch (e) {
        setIsLoading(false)
        setErrors({ ...errors, email: 'Network error. Please try again.' })
      }
    }
  }

  // Get step icon
  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <Home className="h-5 w-5" />
      case 1:
        return <Palette className="h-5 w-5" />
      case 2:
        return <CreditCard className="h-5 w-5" /> // Plan
      case 3:
        return <Frame className="h-5 w-5" /> // Customise
      case 4:
        return <CheckCircle className="h-5 w-5" /> // Review
      case 5:
        return <CreditCard className="h-5 w-5" /> // Checkout
      default:
        return null
    }
  }

  // Get step name
  const getStepName = (step) => {
    switch (step) {
      case 0:
        return "Intro"
      case 1:
        return "Preferences"
      case 2:
        return "Plan"
      case 3:
        return "Customise"
      case 4:
        return "Review"
      case 5:
        return "Checkout"
      default:
        return ""
    }
  }

  // Get step completion status
  const getStepStatus = (step) => {
    if (step > currentStep) return "upcoming"
    if (step === currentStep) return "current"

    // Check if previous steps are completed properly
    switch (step) {
      case 1:
        return formData.artStyles.length > 0 ? "complete" : "incomplete"
      case 2:
        return formData.subscriptionPlan ? "complete" : "incomplete"
      default:
        return "complete"
    }
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 p-6">
            <div className="space-y-4 text-center">
              <CardTitle className="text-3xl md:text-4xl font-serif font-bold">
                Redefine Your Space with Canvas Club
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed">
                A quarterly art subscription that transforms your home and supports emerging artists
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              <Card className="bg-primary/5 border-primary/20 shadow-subtle rounded-lg overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="mx-auto bg-primary/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Rotating Gallery</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Bored of the same pieces on your wall? Refresh your space quarterly with new, curated artwork.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 shadow-subtle rounded-lg overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="mx-auto bg-primary/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                    <Palette className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Discover Your Style</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Not sure of your artistic taste? Our personalised curation helps you explore and refine your
                    preferences.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20 shadow-subtle rounded-lg overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px]">
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="mx-auto bg-primary/10 w-14 h-14 flex items-center justify-center rounded-full mb-6">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-3">Support Artists</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Help emerging artists make a living through their passion while gaining access to their creative
                    journey.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative mt-10 mb-10">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FAFAFA] px-4 text-muted-foreground font-medium tracking-wider">How It Works</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-5">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted shadow-subtle">
                  <img
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&h=450&fit=crop"
                    alt="Living room with art"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-2xl font-serif">Transform Your Space</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every quarter, receive carefully selected artwork based on your preferences. Create a constantly
                  evolving gallery in your home that reflects your evolving taste and style.
                </p>
              </div>

              <div className="space-y-5">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted shadow-subtle">
                  <img
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=450&fit=crop"
                    alt="Artist creating work"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-2xl font-serif">Empower Artists</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your subscription directly supports talented artists at every stage of their career. We ensure fair
                  compensation and exposure for creators, helping them sustain their artistic practice.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-8 border border-primary/20 shadow-subtle mt-10">
              <h3 className="text-2xl font-serif mb-4">The Canvas Club Experience</h3>
              <p className="mb-6 leading-relaxed">
                Our personalised art subscription service helps you discover new artists and styles while keeping your
                space fresh and inspiring. With quarterly deliveries, flexible options, and exclusive gallery access,
                you'll never get bored of your walls again.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                  <span className="leading-relaxed">Quarterly art refreshes with monthly payment plans</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                  <span className="leading-relaxed">Personalised curation based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                  <span className="leading-relaxed">Options for prints, limited editions, and original artwork</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                  <span className="leading-relaxed">Professional framing available for a polished look</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 mt-1 shrink-0" />
                  <span className="leading-relaxed">
                    Invites to exclusive exhibitions at our network of partner galleries
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-8 p-6">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                <Palette className="h-6 w-6 text-primary" />
                Art Preferences
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Select the art styles that resonate with you. This helps us curate your personalised collection.
              </CardDescription>
            </div>

            <div className="space-y-6 mt-6">
              <Label className="text-lg font-medium">Select your preferred art styles (select all that apply)</Label>
              <p className="text-sm text-muted-foreground">Click a style to select it. Click the expand button to see and select specific sub-styles.</p>

              <StyleSelector
                selectedStyles={formData.artStyles}
                selectedSubStyles={formData.subStyles}
                onToggleStyle={(style) => handleChange("artStyles", style)}
                onToggleSubStyle={(subStyle) => handleChange("subStyles", subStyle)}
              />

              {errors.artStyles && <p className="text-sm text-red-500 mt-2">{errors.artStyles}</p>}
            </div>
          </div>
        )
      case 2:
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
              <span className={formData.billingCycle === "monthly" ? "font-medium" : "text-muted-foreground"}>
                Monthly
              </span>
              <Switch
                checked={formData.billingCycle === "yearly"}
                onCheckedChange={(checked) => handleChange("billingCycle", checked ? "yearly" : "monthly")}
                aria-label="Toggle between monthly and yearly billing"
              />
              <span className={formData.billingCycle === "yearly" ? "font-medium" : "text-muted-foreground"}>
                Yearly <Badge className="ml-1 bg-primary/20 text-primary">Save 15%</Badge>
              </span>
            </div>

            <RadioGroup
              value={formData.subscriptionPlan}
              onValueChange={(value) => handleChange("subscriptionPlan", value)}
              className="space-y-4 mt-6"
            >
              <div
                className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${formData.subscriptionPlan === "Basic" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Basic" id="plan-basic" className="text-primary border-primary/50" />
                <div className="flex flex-col">
                  <Label htmlFor="plan-basic" className="font-medium font-serif text-lg">
                    Basic
                  </Label>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    £{formData.billingCycle === "yearly" ? Math.round(10 * 12 * 0.85) / 12 : 10}/month - Perfect for
                    beginners
                  </p>
                  <ul className="text-sm mt-4 space-y-2 leading-relaxed">
                    <li>• 1 artwork per quarter</li>
                    <li>• Emerging artists only</li>
                    <li>• Print quality only</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${formData.subscriptionPlan === "Standard" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Standard" id="plan-standard" className="text-primary border-primary/50" />
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Label htmlFor="plan-standard" className="font-medium font-serif text-lg">
                      Standard
                    </Label>
                    <Badge className="ml-2 bg-primary/20 text-primary">Most Popular</Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    £{formData.billingCycle === "yearly" ? Math.round(25 * 12 * 0.85) / 12 : 25}/month - Our most
                    popular plan
                  </p>
                  <ul className="text-sm mt-4 space-y-2 leading-relaxed">
                    <li>• 3 artworks per quarter</li>
                    <li>• Emerging and Mid-Career artists</li>
                    <li>• Print and Limited Edition options</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${formData.subscriptionPlan === "Premium" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Premium" id="plan-premium" className="text-primary border-primary/50" />
                <div className="flex flex-col">
                  <Label htmlFor="plan-premium" className="font-medium font-serif text-lg">
                    Premium
                  </Label>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    £{formData.billingCycle === "yearly" ? Math.round(40 * 12 * 0.85) / 12 : 40}/month - For serious
                    collectors
                  </p>
                  <ul className="text-sm mt-4 space-y-2 leading-relaxed">
                    <li>• 5 artworks per quarter</li>
                    <li>• Access to all artist tiers</li>
                    <li>• All art types including Originals</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-4 p-6 rounded-lg border transition-all shadow-subtle ${formData.subscriptionPlan === "Custom" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Custom" id="plan-custom" className="text-primary border-primary/50" />
                <div className="flex flex-col w-full">
                  <Label htmlFor="plan-custom" className="font-medium font-serif text-lg">
                    Custom
                  </Label>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    £{formData.billingCycle === "yearly" ? Math.round(10 * 12 * 0.85) / 12 : 10} per piece/month - Build
                    your own quarterly collection
                  </p>

                  {formData.subscriptionPlan === "Custom" && (
                    <div className="mt-6 w-full max-w-xs">
                      <Label htmlFor="customPieces" className="text-sm">
                        Number of pieces per month (1-30)
                      </Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-sm border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => {
                            const current = Number.parseInt(formData.customPieces)
                            if (current > 1) {
                              handleChange("customPieces", (current - 1).toString())
                            }
                          }}
                          disabled={Number.parseInt(formData.customPieces) <= 1}
                          aria-label="Decrease number of pieces"
                        >
                          -
                        </Button>
                        <Input
                          id="customPieces"
                          type="number"
                          min="1"
                          max="30"
                          value={formData.customPieces}
                          onChange={(e) => handleChange("customPieces", e.target.value)}
                          className="text-center h-10 rounded-sm shadow-subtle"
                          aria-label="Number of pieces per month"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-sm border-primary/30 text-primary hover:bg-primary/10"
                          onClick={() => {
                            const current = Number.parseInt(formData.customPieces)
                            if (current < 30) {
                              handleChange("customPieces", (current + 1).toString())
                            }
                          }}
                          disabled={Number.parseInt(formData.customPieces) >= 30}
                          aria-label="Increase number of pieces"
                        >
                          +
                        </Button>
                      </div>
                      {errors.customPieces && <p className="text-sm text-red-500 mt-2">{errors.customPieces}</p>}

                      <p className="text-sm font-medium mt-4">
                        Total: £
                        {formData.billingCycle === "yearly"
                          ? Math.round(Number.parseInt(formData.customPieces) * 10 * 12 * 0.85) / 12
                          : Number.parseInt(formData.customPieces) * 10}
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
      case 3:
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
                    <Label htmlFor="artistTier" className="text-lg font-medium">
                      Artist Tier
                    </Label>
                    <RadioGroup
                      value={formData.artistTier}
                      onValueChange={(value) => handleChange("artistTier", value)}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artistTier === "Emerging" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Emerging" id="tier-emerging" className="sr-only" />
                        <Label htmlFor="tier-emerging" className="font-medium font-serif text-lg cursor-pointer">
                          Emerging
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">New talent with fresh perspectives</p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          Base Price
                        </Badge>
                      </div>

                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artistTier === "Mid-Career" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Mid-Career" id="tier-midcareer" className="sr-only" />
                        <Label htmlFor="tier-midcareer" className="font-medium font-serif text-lg cursor-pointer">
                          Mid-Career
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          Established with growing recognisition
                        </p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          1.8x Multiplier
                        </Badge>
                      </div>

                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artistTier === "Established" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Established" id="tier-established" className="sr-only" />
                        <Label htmlFor="tier-established" className="font-medium font-serif text-lg cursor-pointer">
                          Established
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">
                          Renowned artists with significant impact
                        </p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          3.5x Multiplier
                        </Badge>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <Label htmlFor="artType" className="text-lg font-medium">
                      Art Type
                    </Label>
                    <RadioGroup
                      value={formData.artType}
                      onValueChange={(value) => handleChange("artType", value)}
                      className="grid grid-cols-1 gap-4"
                    >
                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artType === "Print" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Print" id="type-print" className="sr-only" />
                        <Label htmlFor="type-print" className="font-medium font-serif text-lg cursor-pointer">
                          Print
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">High-quality reproduction</p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          Base Price
                        </Badge>
                      </div>

                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artType === "Limited Edition Print" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Limited Edition Print" id="type-limited" className="sr-only" />
                        <Label htmlFor="type-limited" className="font-medium font-serif text-lg cursor-pointer">
                          Limited Edition
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">Numbered and signed by the artist</p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          2.5x Multiplier
                        </Badge>
                      </div>

                      <div
                        className={`flex flex-col p-6 rounded-lg border transition-all shadow-subtle ${formData.artType === "Original" ? "border-primary bg-primary/5" : "border-border"}`}
                      >
                        <RadioGroupItem value="Original" id="type-original" className="sr-only" />
                        <Label htmlFor="type-original" className="font-medium font-serif text-lg cursor-pointer">
                          Original
                        </Label>
                        <p className="text-muted-foreground mt-2 leading-relaxed">One-of-a-kind original artwork</p>
                        <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                          8x Multiplier
                        </Badge>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div>
                  <div className="sticky top-6">
                    <div className="aspect-square relative rounded-lg overflow-hidden bg-muted shadow-subtle mb-6">
                      <img
                        src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop"
                        alt="Art preview"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-lg shadow-subtle text-center">
                          <p className="font-serif text-lg mb-2">Preview</p>
                          <p className="text-sm text-muted-foreground">
                            {formData.artistTier} Artist • {formData.artType} • {formData.size}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full mb-6 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => alert("Wall visualisation tool would open here")}
                    >
                      <Eye className="mr-2 h-4 w-4" /> See how it looks on your wall
                    </Button>

                    <div className="space-y-4">
                      <Label htmlFor="size" className="text-lg font-medium">
                        Size
                      </Label>
                      <RadioGroup
                        value={formData.size}
                        onValueChange={(value) => handleChange("size", value)}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div
                          className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${formData.size === "A4" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem value="A4" id="size-a4" className="sr-only" />
                          <Label htmlFor="size-a4" className="font-medium font-serif text-lg cursor-pointer">
                            A4
                          </Label>
                          <p className="text-muted-foreground mt-2 leading-relaxed">21.0 × 29.7 cm</p>
                          <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                            Base Price
                          </Badge>
                        </div>

                        <div
                          className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${formData.size === "A3" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem value="A3" id="size-a3" className="sr-only" />
                          <Label htmlFor="size-a3" className="font-medium font-serif text-lg cursor-pointer">
                            A3
                          </Label>
                          <p className="text-muted-foreground mt-2 leading-relaxed">29.7 × 42.0 cm</p>
                          <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                            1.25x Multiplier
                          </Badge>
                        </div>

                        <div
                          className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${formData.size === "A2" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem value="A2" id="size-a2" className="sr-only" />
                          <Label htmlFor="size-a2" className="font-medium font-serif text-lg cursor-pointer">
                            A2
                          </Label>
                          <p className="text-muted-foreground mt-2 leading-relaxed">42.0 × 59.4 cm</p>
                          <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                            1.75x Multiplier
                          </Badge>
                        </div>

                        <div
                          className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${formData.size === "A1" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem value="A1" id="size-a1" className="sr-only" />
                          <Label htmlFor="size-a1" className="font-medium font-serif text-lg cursor-pointer">
                            A1
                          </Label>
                          <p className="text-muted-foreground mt-2 leading-relaxed">59.4 × 84.1 cm</p>
                          <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                            2.6x Multiplier
                          </Badge>
                        </div>

                        <div
                          className={`flex flex-col p-4 rounded-lg border transition-all shadow-subtle ${formData.size === "A0" ? "border-primary bg-primary/5" : "border-border"}`}
                        >
                          <RadioGroupItem value="A0" id="size-a0" className="sr-only" />
                          <Label htmlFor="size-a0" className="font-medium font-serif text-lg cursor-pointer">
                            A0
                          </Label>
                          <p className="text-muted-foreground mt-2 leading-relaxed">84.1 × 118.9 cm</p>
                          <Badge variant="outline" className="mt-4 w-fit border-primary/30 text-primary">
                            4.0x Multiplier
                          </Badge>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center space-x-3 p-6 rounded-lg border shadow-subtle">
                <Checkbox
                  id="frameCommitment"
                  checked={formData.frameCommitment}
                  onCheckedChange={(checked) => handleChange("frameCommitment", checked)}
                  className="text-primary border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <div className="space-y-2">
                  <Label htmlFor="frameCommitment" className="font-medium font-serif text-lg">
                    Include premium frames with artwork
                  </Label>
                  <p className="text-muted-foreground leading-relaxed">
                    Add £12 per month for professionally framed artwork
                  </p>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20 shadow-subtle mt-4">
                <CardContent className="pt-8 pb-6 px-6">
                  <h3 className="text-xl font-serif mb-6">Price Breakdown</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-base">
                      <span>Base Price:</span>
                      <span>£{priceBreakdown.base.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span>Artist Tier ({formData.artistTier}):</span>
                      <span>+£{priceBreakdown.artistTier.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span>Art Type ({formData.artType}):</span>
                      <span>+£{priceBreakdown.artType.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-base">
                      <span>Size ({formData.size}):</span>
                      <span>+£{priceBreakdown.size.toFixed(2)}</span>
                    </div>

                    {formData.frameCommitment && (
                      <div className="flex justify-between text-base">
                        <span>Premium Frames:</span>
                        <span>+£12.00</span>
                      </div>
                    )}

                    {formData.billingCycle === "yearly" && (
                      <div className="flex justify-between text-base text-green-600">
                        <span>Annual Discount (15%):</span>
                        <span>-£{priceBreakdown.discount.toFixed(2)}</span>
                      </div>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total {formData.billingCycle === "yearly" ? "Monthly" : ""} Price:</span>
                      <span>£{priceBreakdown.total.toFixed(2)}</span>
                    </div>

                    {formData.billingCycle === "yearly" && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Annual payment:</span>
                        <span>£{(priceBreakdown.total * 12).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-8 p-6">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                <CheckCircle className="h-6 w-6 text-primary" />
                Review Your Selection
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Review your art subscription details before proceeding to checkout.
              </CardDescription>
            </div>

            <div className="grid gap-8 mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop",
                  "https://images.unsplash.com/photo-1573221566340-81bdde00e00b?w=500&h=500&fit=crop",
                  "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=500&h=500&fit=crop",
                ].map((image, index) => (
                  <div key={index} className="aspect-square relative bg-muted rounded-lg overflow-hidden shadow-subtle">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Preview Artwork ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
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
                          {formData.artStyles.length > 0 ? (
                            formData.artStyles.map((style) => (
                              <Badge key={style} variant="secondary" className="bg-white text-[#121212] shadow-subtle">
                                {style}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm">None selected</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Subscription Plan</h4>
                        <p className="font-medium font-serif">{formData.subscriptionPlan}</p>
                        {formData.subscriptionPlan === "Custom" && (
                          <p className="text-sm">{formData.customPieces} pieces per month</p>
                        )}
                        <p className="text-sm">
                          Billed {formData.billingCycle === "yearly" ? "annually" : "monthly"}
                          {formData.billingCycle === "yearly" && " (15% discount applied)"}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-2" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Artist Tier</h4>
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {formData.artistTier}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({priceMultipliers.artistTier[formData.artistTier]}x)
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Art Type</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {formData.artType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({priceMultipliers.artType[formData.artType]}x)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Size</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {formData.size}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({priceMultipliers.size[formData.size]}x)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Frame Commitment</h4>
                      <p>{formData.frameCommitment ? "Yes (adds £12 to monthly price)" : "No"}</p>
                    </div>

                    <Separator className="my-2" />

                    <div className="bg-primary/5 p-6 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-serif text-lg">
                          Final {formData.billingCycle === "yearly" ? "Monthly" : ""} Price:
                        </span>
                        <span className="text-2xl font-bold font-serif">£{priceBreakdown.total.toFixed(2)}</span>
                      </div>
                      {formData.billingCycle === "yearly" && (
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>Annual payment:</span>
                          <span>£{(priceBreakdown.total * 12).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 shadow-subtle">
                <h3 className="text-xl font-serif mb-4">What Happens Next?</h3>
                <ol className="space-y-3 mt-4">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                      1
                    </span>
                    <span>Complete checkout and create your account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                      2
                    </span>
                    <span>Our curators will select artwork based on your preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                      3
                    </span>
                    <span>Your first quarterly delivery will arrive within 7-10 business days</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary font-medium rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                      4
                    </span>
                    <span>Manage your subscription anytime through your account dashboard</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-8 p-6">
            <div className="space-y-3">
              <CardTitle className="flex items-center gap-3 text-2xl font-serif">
                <CreditCard className="h-6 w-6 text-primary" />
                Checkout
              </CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Complete your subscription purchase and start receiving curated artwork.
              </CardDescription>
            </div>

            {showSuccess ? (
              <Alert className="bg-primary/10 border-primary/20 shadow-subtle">
                <div className="flex flex-col items-center text-center py-6">
                  <CheckCircle className="h-14 w-14 text-primary mb-4" />
                  <AlertDescription className="text-[#121212] text-xl font-medium font-serif">
                    Your subscription has been successfully activated!
                  </AlertDescription>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    We're excited to start curating your personalised art collection. Your first quarterly artwork
                    delivery will arrive within 7-10 business days.
                  </p>

                  <div className="mt-8 p-6 border rounded-lg bg-white w-full max-w-md">
                    <h4 className="font-serif text-lg mb-4">Refer a Friend, Get a Free Artwork</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Share this code with friends and you'll both receive a free artwork when they subscribe.
                    </p>
                    <div className="bg-primary/5 p-3 rounded-md text-center font-medium text-lg mb-4">CANVASCLUB25</div>
                    <Button
                      className="w-full rounded-sm bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => alert("Referral link copied to clipboard!")}
                    >
                      <Gift className="mr-2 h-4 w-4" /> Share Referral Link
                    </Button>
                  </div>
                </div>
              </Alert>
            ) : (
              <>
                <Card className="bg-primary/5 border-primary/20 shadow-subtle mt-6">
                  <CardContent className="pt-8 pb-6 px-6">
                    <h3 className="text-xl font-serif mb-6">Order Summary</h3>

                    <div className="space-y-3">
                      <div className="flex justify-between text-base">
                        <span>Subscription Plan:</span>
                        <span>{formData.subscriptionPlan}</span>
                      </div>

                      <div className="flex justify-between text-base">
                        <span>Artist Tier:</span>
                        <span>{formData.artistTier}</span>
                      </div>

                      <div className="flex justify-between text-base">
                        <span>Art Type:</span>
                        <span>{formData.artType}</span>
                      </div>

                      <div className="flex justify-between text-base">
                        <span>Size:</span>
                        <span>{formData.size}</span>
                      </div>

                      <div className="flex justify-between text-base">
                        <span>Billing Cycle:</span>
                        <span className="capitalize">{formData.billingCycle}</span>
                      </div>

                      <Separator className="my-4" />

                      <div className="flex justify-between font-bold text-lg">
                        <span>Total {formData.billingCycle === "yearly" ? "Monthly" : ""} Price:</span>
                        <span>£{priceBreakdown.total.toFixed(2)}</span>
                      </div>

                      {formData.billingCycle === "yearly" && (
                        <div className="flex justify-between text-sm">
                          <span>Annual payment:</span>
                          <span>£{(priceBreakdown.total * 12).toFixed(2)}</span>
                        </div>
                      )}

                      {formData.frameCommitment && (
                        <div className="text-sm text-muted-foreground mt-4 leading-relaxed">
                          * Includes premium frames with £12 monthly charge applied
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6 border p-6 rounded-lg shadow-subtle mt-6">
                  <h3 className="font-serif text-xl">Account Information</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="your@email.com"
                        className="h-12 rounded-sm shadow-subtle"
                        aria-required="true"
                      />
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-medium">
                        Create Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="Min 6 characters"
                        className="h-12 rounded-sm shadow-subtle"
                        aria-required="true"
                      />
                      {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralCode" className="font-medium">
                        Referral Code (Optional)
                      </Label>
                      <Input
                        id="referralCode"
                        value={formData.referralCode}
                        onChange={(e) => handleChange("referralCode", e.target.value)}
                        placeholder="Enter code if you have one"
                        className="h-12 rounded-sm shadow-subtle"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 border p-6 rounded-lg shadow-subtle mt-6">
                  <h3 className="font-serif text-xl">Payment Method</h3>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <Button
                      type="button"
                      variant={formData.paymentMethod === "card" ? "default" : "outline"}
                      className={`h-16 rounded-sm ${formData.paymentMethod === "card" ? "bg-primary text-primary-foreground" : "border-primary/30 hover:bg-primary/10"}`}
                      onClick={() => handleChange("paymentMethod", "card")}
                    >
                      <CreditCardIcon className="h-5 w-5 mr-2" /> Credit Card
                    </Button>
                    <Button
                      type="button"
                      variant={formData.paymentMethod === "paypal" ? "default" : "outline"}
                      className={`h-16 rounded-sm ${formData.paymentMethod === "paypal" ? "bg-primary text-primary-foreground" : "border-primary/30 hover:bg-primary/10"}`}
                      onClick={() => handleChange("paymentMethod", "paypal")}
                    >
                      <Paypal className="h-5 w-5 mr-2" /> PayPal
                    </Button>
                    <Button
                      type="button"
                      variant={formData.paymentMethod === "apple" ? "default" : "outline"}
                      className={`h-16 rounded-sm ${formData.paymentMethod === "apple" ? "bg-primary text-primary-foreground" : "border-primary/30 hover:bg-primary/10"}`}
                      onClick={() => handleChange("paymentMethod", "apple")}
                    >
                      <Apple className="h-5 w-5 mr-2" /> Apple Pay
                    </Button>
                  </div>

                  {formData.paymentMethod === "card" && (
                    <div className="grid gap-6 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="cardName" className="font-medium">
                            Name on Card
                          </Label>
                          <Input id="cardName" placeholder="John Smith" className="h-12 rounded-sm shadow-subtle" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="cardNumber" className="font-medium">
                            Card Number
                          </Label>
                          <Input
                            id="cardNumber"
                            placeholder="**** **** **** ****"
                            className="h-12 rounded-sm shadow-subtle"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="expMonth" className="font-medium">
                            Expiry Month
                          </Label>
                          <Input id="expMonth" placeholder="MM" className="h-12 rounded-sm shadow-subtle" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="expYear" className="font-medium">
                            Expiry Year
                          </Label>
                          <Input id="expYear" placeholder="YY" className="h-12 rounded-sm shadow-subtle" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="cvc" className="font-medium">
                            CVC
                          </Label>
                          <Input id="cvc" placeholder="***" className="h-12 rounded-sm shadow-subtle" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mt-2">
                        <Checkbox
                          id="savePaymentInfo"
                          checked={formData.savePaymentInfo}
                          onCheckedChange={(checked) => handleChange("savePaymentInfo", checked)}
                          className="text-primary border-primary/50"
                        />
                        <Label htmlFor="savePaymentInfo" className="text-sm">
                          Save payment information for future purchases
                        </Label>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA] p-6">
      <Card className="w-full max-w-4xl shadow-subtle rounded-lg overflow-hidden">
        <CardHeader className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">Canvas Club</h2>

            <Collapsible open={showSummary} onOpenChange={setShowSummary} className="md:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  Summary {showSummary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-3 border rounded-md bg-primary/5">
                <div className="text-sm space-y-2">
                  {currentStep > 1 && formData.artStyles.length > 0 && (
                    <div>
                      <span className="font-medium">Styles:</span> {formData.artStyles.slice(0, 3).join(", ")}
                      {formData.artStyles.length > 3 && "..."}
                    </div>
                  )}
                  {currentStep > 3 && formData.subscriptionPlan && (
                    <div>
                      <span className="font-medium">Plan:</span> {formData.subscriptionPlan}
                    </div>
                  )}
                  {currentStep > 4 && (
                    <div>
                      <span className="font-medium">Price:</span> £{priceBreakdown.total}/month
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="hidden md:block text-sm text-muted-foreground">Step {currentStep + 1} of 6</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-4">
            {Array.from({ length: 6 }).map((_, index) => {
              const status = getStepStatus(index)
              return (
                <div
                  key={index}
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
                    onClick={() => handleStepClick(index)}
                    disabled={index > currentStep}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs transition-all ${
                      status === "current"
                        ? "bg-primary text-primary-foreground"
                        : status === "complete"
                          ? "bg-primary/20 hover:bg-primary/30"
                          : "bg-muted cursor-not-allowed"
                    }`}
                    aria-label={`Go to step ${index + 1}: ${getStepName(index)}`}
                  >
                    {getStepIcon(index)}
                  </button>
                  <span className="text-xs mt-2 hidden md:inline font-medium">{getStepName(index)}</span>
                </div>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="p-0" ref={formRef} tabIndex="-1">
          {renderStepContent()}
        </CardContent>

        <CardFooter className="flex justify-between p-6">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2 rounded-sm border-primary/30 text-primary hover:bg-primary/10 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                className={`flex items-center gap-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${currentStep > 0 ? "ml-auto" : ""}`}
              >
                {currentStep === 0 ? "Get Started" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || showSuccess}
              className={`flex items-center gap-2 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all ${currentStep > 0 ? "ml-auto" : ""}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm & Pay
                  <CreditCard className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
