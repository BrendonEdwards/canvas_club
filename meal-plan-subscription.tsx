"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Loader2,
  UtensilsCrossed,
  Star,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Apple,
  Clock,
  Leaf,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function MealPlanSubscription() {
  // State for current step
  const [currentStep, setCurrentStep] = useState(0)

  // State for form data
  const [formData, setFormData] = useState({
    dietaryPreferences: [],
    mealRatings: Array(6).fill(""),
    subscriptionPlan: "",
    customMeals: "3",
    mealType: "Standard",
    servingSize: "2",
    organicIngredients: false,
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
    mealType: 0,
    servingSize: 0,
    organic: 0,
    total: 0,
  })

  // Price multipliers
  const priceMultipliers = {
    mealType: {
      Standard: 1,
      Premium: 1.5,
      Gourmet: 2.2,
    },
    servingSize: {
      "1": 1,
      "2": 1.8,
      "4": 3.2,
      "6": 4.5,
    },
  }

  // Calculate final price based on selections
  const calculatePrice = () => {
    let basePrice = 0

    // Base subscription price
    switch (formData.subscriptionPlan) {
      case "Basic":
        basePrice = 30
        break
      case "Standard":
        basePrice = 45
        break
      case "Premium":
        basePrice = 60
        break
      case "Custom":
        basePrice = Number.parseInt(formData.customMeals) * 15
        break
      default:
        basePrice = 0
    }

    // Apply multipliers
    const mealTypeMultiplier = priceMultipliers.mealType[formData.mealType] || 1
    const servingSizeMultiplier = priceMultipliers.servingSize[formData.servingSize] || 1

    // Calculate component prices
    const mealTypePrice = basePrice * (mealTypeMultiplier - 1)
    const servingSizePrice = (basePrice + mealTypePrice) * (servingSizeMultiplier - 1)

    // Organic ingredients cost
    const organicPrice = formData.organicIngredients ? basePrice * 0.2 : 0

    // Calculate total
    const total = basePrice + mealTypePrice + servingSizePrice + organicPrice

    // Return the breakdown without setting state
    return {
      base: basePrice,
      mealType: mealTypePrice,
      servingSize: servingSizePrice,
      organic: organicPrice,
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
    if (field === "dietaryPreferences") {
      // Toggle the dietary preference in the array
      const updatedPreferences = [...formData.dietaryPreferences]
      const index = updatedPreferences.indexOf(value)

      if (index === -1) {
        updatedPreferences.push(value)
      } else {
        updatedPreferences.splice(index, 1)
      }

      setFormData({
        ...formData,
        dietaryPreferences: updatedPreferences,
      })
    } else if (field.startsWith("rating")) {
      // Update a specific rating
      const index = Number.parseInt(field.replace("rating", ""))
      const updatedRatings = [...formData.mealRatings]
      updatedRatings[index] = value

      setFormData({
        ...formData,
        mealRatings: updatedRatings,
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
        if (!formData.dietaryPreferences.length) {
          newErrors.dietaryPreferences = "Please select at least one dietary preference"
        }
        break
      case 2:
        const emptyRatings = formData.mealRatings.some(
          (rating) => !rating || Number.parseInt(rating) < 1 || Number.parseInt(rating) > 5,
        )
        if (emptyRatings) {
          newErrors.mealRatings = "Please rate all meals between 1-5"
        }
        break
      case 3:
        if (!formData.subscriptionPlan) {
          newErrors.subscriptionPlan = "Please select a subscription plan"
        }
        if (formData.subscriptionPlan === "Custom") {
          const meals = Number.parseInt(formData.customMeals)
          if (isNaN(meals) || meals < 1 || meals > 7) {
            newErrors.customMeals = "Please enter between 1-7 meals"
          }
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

  // Handle submit
  const handleSubmit = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSuccess(true)
    }, 2000)
  }

  // Get step icon
  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <Home className="h-5 w-5" />
      case 1:
        return <Apple className="h-5 w-5" />
      case 2:
        return <Star className="h-5 w-5" />
      case 3:
        return <Clock className="h-5 w-5" />
      case 4:
        return <UtensilsCrossed className="h-5 w-5" />
      case 5:
        return <CheckCircle className="h-5 w-5" />
      case 6:
        return <CreditCard className="h-5 w-5" />
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
        return "Taste"
      case 3:
        return "Plan"
      case 4:
        return "Customize"
      case 5:
        return "Review"
      case 6:
        return "Checkout"
      default:
        return ""
    }
  }

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold">Simplify Your Meals with MealPlan</CardTitle>
              <CardDescription className="text-lg">
                A weekly meal subscription that saves time and delivers delicious, chef-crafted meals to your door
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="bg-primary/5 border-primary">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                  <p className="text-muted-foreground">
                    Skip the grocery shopping and meal planning. We deliver pre-portioned ingredients right to your
                    door.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Discover New Flavors</h3>
                  <p className="text-muted-foreground">
                    Explore diverse cuisines and recipes crafted by professional chefs to expand your culinary horizons.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Reduce Waste</h3>
                  <p className="text-muted-foreground">
                    Perfectly portioned ingredients mean less food waste and a more sustainable approach to eating.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">How It Works</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=Meal Preparation"
                    alt="Chef preparing meal"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-medium">Chef-Crafted Recipes</h3>
                <p className="text-muted-foreground">
                  Our team of professional chefs develops delicious, balanced recipes that are easy to prepare at home.
                  Each week, choose from 20+ new recipes across various cuisines and dietary preferences.
                </p>
              </div>

              <div className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                  <img
                    src="/placeholder.svg?height=300&width=500&text=Meal Delivery"
                    alt="Meal kit delivery"
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-medium">Convenient Delivery</h3>
                <p className="text-muted-foreground">
                  We deliver fresh, pre-portioned ingredients in insulated packaging to keep everything fresh. Choose
                  your delivery day and time window for maximum convenience.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <h3 className="text-xl font-medium mb-2">The MealPlan Experience</h3>
              <p className="mb-4">
                Our meal subscription service helps you eat well without the hassle of planning and shopping. With
                flexible options and a variety of cuisines, you'll never get bored of your meals again.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>Weekly deliveries with flexible subscription options</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>Personalized meal selection based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>Options for different dietary needs and serving sizes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 shrink-0" />
                  <span>Premium ingredients with organic options available</span>
                </li>
              </ul>
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-primary" />
                Dietary Preferences
              </CardTitle>
              <CardDescription>
                Select your dietary preferences and restrictions. This helps us recommend suitable meals for you.
              </CardDescription>
            </div>

            <div className="space-y-4">
              <Label className="text-base">Select your dietary preferences (select all that apply)</Label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Vegetarian",
                  "Vegan",
                  "Pescatarian",
                  "Gluten-Free",
                  "Dairy-Free",
                  "Keto",
                  "Paleo",
                  "Low-Carb",
                  "Mediterranean",
                  "High-Protein",
                  "Low-Calorie",
                  "Nut-Free",
                  "Soy-Free",
                  "Shellfish-Free",
                  "No Restrictions",
                ].map((preference) => (
                  <div
                    key={preference}
                    className={`flex items-center space-x-2 p-3 rounded-md border transition-all ${formData.dietaryPreferences.includes(preference) ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <Checkbox
                      id={`preference-${preference}`}
                      checked={formData.dietaryPreferences.includes(preference)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleChange("dietaryPreferences", preference)
                        } else {
                          handleChange("dietaryPreferences", preference)
                        }
                      }}
                    />
                    <Label htmlFor={`preference-${preference}`} className="cursor-pointer w-full">
                      {preference}
                    </Label>
                  </div>
                ))}
              </div>

              {errors.dietaryPreferences && <p className="text-sm text-red-500">{errors.dietaryPreferences}</p>}

              {formData.dietaryPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-sm font-medium">Selected:</span>
                  {formData.dietaryPreferences.map((preference) => (
                    <Badge key={preference} variant="secondary">
                      {preference}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Taste Preferences
              </CardTitle>
              <CardDescription>Rate these sample meals to help us understand your taste preferences.</CardDescription>
            </div>

            {errors.mealRatings && (
              <Alert variant="destructive">
                <AlertDescription>{errors.mealRatings}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="grid" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="grid" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card
                      key={index}
                      className={`overflow-hidden transition-all ${formData.mealRatings[index] ? "ring-1 ring-primary" : ""}`}
                    >
                      <div className="aspect-square relative bg-muted">
                        <img
                          src={`/placeholder.svg?height=200&width=200&text=Meal ${index + 1}`}
                          alt={`Meal ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        {formData.mealRatings[index] && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary">{formData.mealRatings[index]} ★</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="text-sm font-medium mb-2">{getMealNameForIndex(index)}</div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`rating${index}`} className="text-sm whitespace-nowrap">
                            Rating (1-5):
                          </Label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                type="button"
                                size="icon"
                                variant={formData.mealRatings[index] == rating ? "default" : "outline"}
                                className="h-8 w-8"
                                onClick={() => {
                                  const updatedRatings = [...formData.mealRatings]
                                  updatedRatings[index] = rating.toString()
                                  setFormData({
                                    ...formData,
                                    mealRatings: updatedRatings,
                                  })
                                }}
                              >
                                {rating}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-4 space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="w-16 h-16 shrink-0 bg-muted rounded-md overflow-hidden">
                      <img
                        src={`/placeholder.svg?height=64&width=64&text=${index + 1}`}
                        alt={`Meal ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{getMealNameForIndex(index)}</div>
                      <div className="text-xs text-muted-foreground">Cuisine: {getMealCuisineForIndex(index)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          type="button"
                          size="icon"
                          variant={formData.mealRatings[index] == rating ? "default" : "outline"}
                          className="h-8 w-8"
                          onClick={() => {
                            const updatedRatings = [...formData.mealRatings]
                            updatedRatings[index] = rating.toString()
                            setFormData({
                              ...formData,
                              mealRatings: updatedRatings,
                            })
                          }}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Choose a subscription plan that fits your meal planning needs. All plans are billed weekly with meals
                delivered on your chosen day.
              </CardDescription>
            </div>

            <RadioGroup
              value={formData.subscriptionPlan}
              onValueChange={(value) => handleChange("subscriptionPlan", value)}
              className="space-y-3"
            >
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${formData.subscriptionPlan === "Basic" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Basic" id="plan-basic" />
                <div className="flex flex-col">
                  <Label htmlFor="plan-basic" className="font-medium">
                    Basic
                  </Label>
                  <p className="text-sm text-muted-foreground">£30/week - Perfect for busy individuals</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 2 meals per week</li>
                    <li>• Standard recipes only</li>
                    <li>• Basic ingredients</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${formData.subscriptionPlan === "Standard" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Standard" id="plan-standard" />
                <div className="flex flex-col">
                  <Label htmlFor="plan-standard" className="font-medium">
                    Standard
                  </Label>
                  <p className="text-sm text-muted-foreground">£45/week - Our most popular plan</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 3 meals per week</li>
                    <li>• Standard and Premium recipes</li>
                    <li>• Quality ingredients</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${formData.subscriptionPlan === "Premium" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Premium" id="plan-premium" />
                <div className="flex flex-col">
                  <Label htmlFor="plan-premium" className="font-medium">
                    Premium
                  </Label>
                  <p className="text-sm text-muted-foreground">£60/week - For culinary enthusiasts</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 4 meals per week</li>
                    <li>• Access to all recipe tiers including Gourmet</li>
                    <li>• Premium ingredients</li>
                  </ul>
                </div>
              </div>

              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${formData.subscriptionPlan === "Custom" ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <RadioGroupItem value="Custom" id="plan-custom" />
                <div className="flex flex-col w-full">
                  <Label htmlFor="plan-custom" className="font-medium">
                    Custom
                  </Label>
                  <p className="text-sm text-muted-foreground">£15 per meal - Build your own weekly menu</p>

                  {formData.subscriptionPlan === "Custom" && (
                    <div className="mt-3 w-full max-w-xs">
                      <Label htmlFor="customMeals" className="text-sm">
                        Number of meals per week (1-7)
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const current = Number.parseInt(formData.customMeals)
                            if (current > 1) {
                              handleChange("customMeals", (current - 1).toString())
                            }
                          }}
                          disabled={Number.parseInt(formData.customMeals) <= 1}
                        >
                          -
                        </Button>
                        <Input
                          id="customMeals"
                          type="number"
                          min="1"
                          max="7"
                          value={formData.customMeals}
                          onChange={(e) => handleChange("customMeals", e.target.value)}
                          className="text-center"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const current = Number.parseInt(formData.customMeals)
                            if (current < 7) {
                              handleChange("customMeals", (current + 1).toString())
                            }
                          }}
                          disabled={Number.parseInt(formData.customMeals) >= 7}
                        >
                          +
                        </Button>
                      </div>
                      {errors.customMeals && <p className="text-sm text-red-500 mt-1">{errors.customMeals}</p>}

                      <p className="text-sm font-medium mt-2">
                        Total: £{Number.parseInt(formData.customMeals) * 15}/week
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>

            {errors.subscriptionPlan && <p className="text-sm text-red-500">{errors.subscriptionPlan}</p>}
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
                Customization
              </CardTitle>
              <CardDescription>Customize your meal features to match your preferences and household.</CardDescription>
            </div>

            <div className="grid gap-6">
              <div className="space-y-3">
                <Label htmlFor="mealType" className="text-base">
                  Meal Type
                </Label>
                <RadioGroup
                  value={formData.mealType}
                  onValueChange={(value) => handleChange("mealType", value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.mealType === "Standard" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="Standard" id="type-standard" className="sr-only" />
                    <Label htmlFor="type-standard" className="font-medium cursor-pointer">
                      Standard
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Everyday recipes</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      Base Price
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.mealType === "Premium" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="Premium" id="type-premium" className="sr-only" />
                    <Label htmlFor="type-premium" className="font-medium cursor-pointer">
                      Premium
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Elevated recipes with premium ingredients</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      1.5x Multiplier
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.mealType === "Gourmet" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="Gourmet" id="type-gourmet" className="sr-only" />
                    <Label htmlFor="type-gourmet" className="font-medium cursor-pointer">
                      Gourmet
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Chef-inspired gourmet recipes</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      2.2x Multiplier
                    </Badge>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="servingSize" className="text-base">
                  Serving Size
                </Label>
                <RadioGroup
                  value={formData.servingSize}
                  onValueChange={(value) => handleChange("servingSize", value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.servingSize === "1" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="1" id="size-1" className="sr-only" />
                    <Label htmlFor="size-1" className="font-medium cursor-pointer">
                      1 Person
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Single serving</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      Base Price
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.servingSize === "2" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="2" id="size-2" className="sr-only" />
                    <Label htmlFor="size-2" className="font-medium cursor-pointer">
                      2 People
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Couple or roommates</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      1.8x Multiplier
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.servingSize === "4" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="4" id="size-4" className="sr-only" />
                    <Label htmlFor="size-4" className="font-medium cursor-pointer">
                      4 People
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Small family</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      3.2x Multiplier
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-col p-4 rounded-lg border transition-all ${formData.servingSize === "6" ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <RadioGroupItem value="6" id="size-6" className="sr-only" />
                    <Label htmlFor="size-6" className="font-medium cursor-pointer">
                      6 People
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">Large family</p>
                    <Badge variant="outline" className="mt-2 w-fit">
                      4.5x Multiplier
                    </Badge>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="flex items-center space-x-2 p-4 rounded-lg border">
                <Checkbox
                  id="organicIngredients"
                  checked={formData.organicIngredients}
                  onCheckedChange={(checked) => handleChange("organicIngredients", checked)}
                />
                <div className="space-y-1">
                  <Label htmlFor="organicIngredients" className="font-medium">
                    Use organic ingredients when available
                  </Label>
                  <p className="text-sm text-muted-foreground">Add 20% to base price for organic ingredients</p>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span>£{priceBreakdown.base.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Meal Type ({formData.mealType}):</span>
                      <span>+£{priceBreakdown.mealType.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>
                        Serving Size ({formData.servingSize} {formData.servingSize === "1" ? "person" : "people"}):
                      </span>
                      <span>+£{priceBreakdown.servingSize.toFixed(2)}</span>
                    </div>

                    {formData.organicIngredients && (
                      <div className="flex justify-between text-sm">
                        <span>Organic Ingredients:</span>
                        <span>+£{priceBreakdown.organic.toFixed(2)}</span>
                      </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between font-bold">
                      <span>Total Weekly Price:</span>
                      <span>£{priceBreakdown.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Review Your Selection
              </CardTitle>
              <CardDescription>Review your meal subscription details before proceeding to checkout.</CardDescription>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="aspect-square relative bg-muted rounded-md overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=150&width=150&text=Meal ${index + 1}`}
                      alt={`Preview Meal ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Your Selections</h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Dietary Preferences</h4>
                        <div className="flex flex-wrap gap-1">
                          {formData.dietaryPreferences.length > 0 ? (
                            formData.dietaryPreferences.map((preference) => (
                              <Badge key={preference} variant="secondary">
                                {preference}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm">None selected</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Subscription Plan</h4>
                        <p className="font-medium">{formData.subscriptionPlan}</p>
                        {formData.subscriptionPlan === "Custom" && (
                          <p className="text-sm">{formData.customMeals} meals per week</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Meal Type</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{formData.mealType}</Badge>
                          <span className="text-xs text-muted-foreground">
                            ({priceMultipliers.mealType[formData.mealType]}x)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Serving Size</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formData.servingSize} {formData.servingSize === "1" ? "person" : "people"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ({priceMultipliers.servingSize[formData.servingSize]}x)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Organic Ingredients</h4>
                        <Badge variant="outline">{formData.organicIngredients ? "Yes" : "No"}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-primary/5 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Final Weekly Price:</span>
                        <span className="text-xl font-bold">£{priceBreakdown.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Checkout
              </CardTitle>
              <CardDescription>
                Complete your subscription purchase and start receiving delicious meals.
              </CardDescription>
            </div>

            {showSuccess ? (
              <Alert className="bg-green-50 border-green-200">
                <div className="flex flex-col items-center text-center py-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mb-2" />
                  <AlertDescription className="text-green-800 text-lg font-medium">
                    Your subscription has been successfully activated!
                  </AlertDescription>
                  <p className="text-green-700 mt-2">
                    We're excited to start delivering your personalized meals. Your first weekly delivery will arrive on
                    your selected day next week.
                  </p>
                </div>
              </Alert>
            ) : (
              <>
                <Card className="bg-primary/5 border-primary">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subscription Plan:</span>
                        <span>{formData.subscriptionPlan}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Meal Type:</span>
                        <span>{formData.mealType}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Serving Size:</span>
                        <span>
                          {formData.servingSize} {formData.servingSize === "1" ? "person" : "people"}
                        </span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between font-bold">
                        <span>Total Weekly Price:</span>
                        <span>£{priceBreakdown.total.toFixed(2)}</span>
                      </div>

                      {formData.organicIngredients && (
                        <div className="text-sm text-muted-foreground mt-2">
                          * Includes organic ingredients with 20% premium applied
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="font-semibold">Payment Details</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for payment information. In a real application, this would be a secure payment
                    form.
                  </p>

                  <div className="grid gap-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Smith" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="**** **** **** ****" disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expMonth">Expiry Month</Label>
                        <Input id="expMonth" placeholder="MM" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expYear">Expiry Year</Label>
                        <Input id="expYear" placeholder="YY" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="***" disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      default:
        return null
    }
  }

  // Add a helper function to get meal name for each meal
  const getMealNameForIndex = (index) => {
    const meals = [
      "Herb-Crusted Salmon",
      "Vegetable Curry",
      "Beef Bourguignon",
      "Mediterranean Pasta",
      "Thai Green Curry",
      "Mexican Burrito Bowl",
    ]
    return meals[index] || "Seasonal Special"
  }

  // Add a helper function to get cuisine for each meal
  const getMealCuisineForIndex = (index) => {
    const cuisines = ["French", "Indian", "French", "Italian", "Thai", "Mexican"]
    return cuisines[index] || "International"
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">MealPlan</h2>
            <div className="text-sm text-muted-foreground">Step {currentStep} of 6</div>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${currentStep === index ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${currentStep === index ? "bg-primary text-white" : currentStep > index ? "bg-primary/20" : "bg-muted"}`}
                >
                  {getStepIcon(index)}
                </div>
                <span className="text-xs mt-1 hidden md:inline">{getStepName(index)}</span>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">{renderStepContent()}</CardContent>

        <CardFooter className="flex justify-between p-6 pt-0">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {currentStep < 6 ? (
            <Button onClick={handleNext} className={`flex items-center gap-1 ${currentStep > 0 ? "ml-auto" : ""}`}>
              {currentStep === 0 ? "Get Started" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || showSuccess}
              className={`flex items-center gap-1 ${currentStep > 0 ? "ml-auto" : ""}`}
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
