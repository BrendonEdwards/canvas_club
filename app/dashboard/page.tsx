"use client"

import { useEffect, useState, Suspense } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, LogOut, Package, RotateCcw, Settings, Sparkles } from "lucide-react"
import { StyleSelector } from "@/components/StyleSelector"
import { findStyle, findSubStyle } from "@/lib/art-data"
import { formatGBP } from "@/lib/pricing"
import type { Preferences, SafeUser } from "@/lib/types"
import type { Recommendation } from "@/lib/recommend"

function styleName(id: string): string {
  return findStyle(id)?.name ?? findSubStyle(id)?.sub.name ?? id
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading, logout } = useAuth()

  const [userData, setUserData] = useState<SafeUser | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [edited, setEdited] = useState<Pick<Preferences, "mainStyles" | "subStyles">>({
    mainStyles: [],
    subStyles: [],
  })
  const [saveStatus, setSaveStatus] = useState("")
  const showWelcome = searchParams.get("welcome") === "1"

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    setUserData(user)
    setEdited({
      mainStyles: user.preferences?.mainStyles ?? [],
      subStyles: user.preferences?.subStyles ?? [],
    })
  }, [user, loading, router])

  useEffect(() => {
    if (!userData) return
    fetch("/api/recommendations")
      .then((res) => (res.ok ? res.json() : { recommendations: [] }))
      .then((data) => setRecommendations(data.recommendations ?? []))
      .catch(() => setRecommendations([]))
  }, [userData])

  const handleSavePreferences = async () => {
    if (!userData) return
    setSaveStatus("saving")
    try {
      const res = await fetch("/api/user/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: { ...userData.preferences, mainStyles: edited.mainStyles, subStyles: edited.subStyles },
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setUserData(updated)
        setSaveStatus("success")
        setTimeout(() => {
          setSaveStatus("")
          setIsEditing(false)
        }, 1500)
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your gallery…</p>
      </div>
    )
  }
  if (!user || !userData) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-primary">Canvas Club</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden md:inline">Welcome, {userData.name}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              onClick={async () => {
                await logout()
                router.push("/")
              }}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {showWelcome && (
          <Alert className="mb-8 bg-primary/10 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="font-serif">Welcome to the Canvas Club pilot!</AlertTitle>
            <AlertDescription>
              Your taste profile is saved. Our curators are preparing your first selection — refine your taste
              anytime below and your matches will update.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="taste">My Taste</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Picked for you */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-serif">Picked for You</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Matched to your styles, sub-genres and ratings
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("taste")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Refine taste
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="overflow-hidden shadow-subtle group hover:shadow-md transition-all">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <Image
                        src={rec.image.src}
                        alt={`${rec.title} by ${rec.artist}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-serif text-lg font-medium leading-tight">{rec.title}</h3>
                      {rec.image.source !== "Unsplash" && (
                        <p className="text-sm text-muted-foreground">{rec.artist}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                          {rec.styleName}
                        </Badge>
                        {rec.subStyleId && (
                          <Badge variant="secondary" className="text-xs">
                            {styleName(rec.subStyleId)}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Next box + plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-primary/5 border-dashed border-2 border-primary/20 flex flex-col items-center justify-center p-8 text-center">
                <Package className="h-12 w-12 text-primary/50 mb-4" />
                <h3 className="font-serif text-lg font-medium mb-2">First Box Preparing</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  Curators are selecting your pieces based on your taste profile.
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-3">
                  <Clock className="h-3.5 w-3.5" /> Pilot deliveries are confirmed by email
                </p>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Your Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <Badge variant="secondary">{userData.subscription?.plan || "Pilot member"}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size preference</span>
                    <span>{userData.subscription?.sizePreference ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame Kit</span>
                    <span>{userData.subscription?.frameKit ? "Included" : "Not yet"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly price (inc VAT)</span>
                    <span className="font-medium">
                      {userData.subscription ? `${formatGBP(userData.subscription.monthlyPrice)}/month` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span>{new Date(userData.joinedDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Originals pipeline */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
              <CardContent className="py-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <h3 className="font-serif text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Originals are coming
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                    We&rsquo;re working with our partner galleries to bring original works into rotation.
                    Early access goes to members on the list — no commitment.
                  </p>
                </div>
                <Button
                  variant={userData.preferences.originalsInterest ? "secondary" : "default"}
                  onClick={async () => {
                    const next = !userData.preferences.originalsInterest
                    const res = await fetch("/api/user/me/preferences", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ preferences: { originalsInterest: next } }),
                    })
                    if (res.ok) setUserData(await res.json())
                  }}
                >
                  {userData.preferences.originalsInterest ? "On the early-access list ✓" : "Join the early-access list"}
                </Button>
              </CardContent>
            </Card>

            {/* Rotation guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  How Rotation Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  {[
                    "Live with your pieces for the quarter — no rush, no pressure.",
                    "Loved something? Tell us and we'll arrange a route to purchase.",
                    "Ready for a refresh? Pack the reusable box and we handle collection.",
                  ].map((text, i) => (
                    <div key={text} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taste">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-serif mb-2">Your Taste Profile</h2>
                  <p className="text-muted-foreground">We use this to curate your quarterly boxes.</p>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Refine Taste
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEdited({
                          mainStyles: userData.preferences.mainStyles,
                          subStyles: userData.preferences.subStyles,
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSavePreferences} disabled={saveStatus === "saving"}>
                      {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>

              {saveStatus === "success" && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>Saved</AlertTitle>
                  <AlertDescription>Your preferences have been updated — your matches will refresh.</AlertDescription>
                </Alert>
              )}
              {saveStatus === "error" && (
                <Alert variant="destructive">
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>Your changes weren&rsquo;t saved. Please try again.</AlertDescription>
                </Alert>
              )}

              {isEditing ? (
                <Card>
                  <CardContent className="pt-6">
                    <StyleSelector
                      selectedStyles={edited.mainStyles}
                      selectedSubStyles={edited.subStyles}
                      onToggleStyle={(id) =>
                        setEdited((prev) => ({
                          ...prev,
                          mainStyles: prev.mainStyles.includes(id)
                            ? prev.mainStyles.filter((s) => s !== id)
                            : [...prev.mainStyles, id],
                        }))
                      }
                      onToggleSubStyle={(id) =>
                        setEdited((prev) => {
                          const subStyles = prev.subStyles.includes(id)
                            ? prev.subStyles.filter((s) => s !== id)
                            : [...prev.subStyles, id]
                          const parent = findSubStyle(id)?.style.id
                          const mainStyles =
                            subStyles.includes(id) && parent && !prev.mainStyles.includes(parent)
                              ? [...prev.mainStyles, parent]
                              : prev.mainStyles
                          return { mainStyles, subStyles }
                        })
                      }
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Styles</CardTitle>
                      <CardDescription>Top-level styles and refined sub-genres</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {userData.preferences.mainStyles.map((id) => (
                          <Badge key={id} className="text-base py-1 px-3">
                            {styleName(id)}
                          </Badge>
                        ))}
                        {userData.preferences.subStyles.map((id) => {
                          const match = findSubStyle(id)
                          return (
                            <Badge key={id} variant="outline" className="text-base py-1 px-3">
                              {match ? `${match.style.name} · ${match.sub.name}` : id}
                            </Badge>
                          )
                        })}
                        {userData.preferences.mainStyles.length === 0 && (
                          <p className="text-muted-foreground">No styles selected yet.</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Ratings</CardTitle>
                      <CardDescription>From your taste quiz</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {Object.entries(userData.preferences.ratings).map(([id, rating]) => (
                        <div key={id} className="flex justify-between items-center text-sm py-0.5">
                          <span>{styleName(id)}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <span>{rating === "love" ? "❤️" : rating === "like" ? "👍" : "👎"}</span>
                            <span className="text-muted-foreground">
                              {rating === "love" ? "Love" : rating === "like" ? "Like" : "Dislike"}
                            </span>
                          </span>
                        </div>
                      ))}
                      {Object.keys(userData.preferences.ratings).length === 0 && (
                        <p className="text-muted-foreground text-sm">No ratings yet.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}
