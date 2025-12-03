"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Package,
  RotateCcw,
  MapPin,
  Star,
  Ticket,
  Palette,
  Clock,
  ChevronRight,
  LogOut,
  User,
  Settings
} from "lucide-react"
import { StyleSelector } from "@/components/StyleSelector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // State for preferences editing
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const [editedPreferences, setEditedPreferences] = useState<any>({ mainStyles: [], subStyles: [] })
  const [saveStatus, setSaveStatus] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Fetch user data
    fetch(`/api/user/${user}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch")
        return res.json()
      })
      .then(data => {
        setUserData(data)
        setEditedPreferences({
            mainStyles: data.preferences?.mainStyles || [],
            subStyles: data.preferences?.subStyles || []
        })
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        // router.push("/login")
      })
  }, [user, router])

  const handleSavePreferences = async () => {
    setSaveStatus("saving")
    try {
        const res = await fetch(`/api/user/${user}/preferences`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                preferences: {
                    ...userData.preferences,
                    mainStyles: editedPreferences.mainStyles,
                    subStyles: editedPreferences.subStyles
                }
            })
        })

        if (res.ok) {
            setSaveStatus("success")
            setUserData({
                ...userData,
                preferences: {
                    ...userData.preferences,
                    mainStyles: editedPreferences.mainStyles,
                    subStyles: editedPreferences.subStyles
                }
            })
            setTimeout(() => {
                setSaveStatus("")
                setIsEditingPreferences(false)
            }, 2000)
        } else {
            setSaveStatus("error")
        }
    } catch (e) {
        setSaveStatus("error")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading dashboard...</p></div>
  if (!user || !userData) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-primary">Canvas Club</h1>
          <div className="flex items-center gap-4">
             <span className="text-sm font-medium hidden md:inline">Welcome, {userData.name}</span>
             <Button variant="ghost" size="icon" onClick={() => logout()}>
               <LogOut className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="taste">My Taste</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Current Rotation */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl font-serif">Current Rotation</h2>
                <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Return due: <span className="font-medium text-foreground ml-1">April 15, 2024</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Mocked Current Art */}
                 {[
                    { title: "Urban Rhythms", artist: "Sarah Jenkins", img: "https://i0.wp.com/manchesterbe.es/wp-content/uploads/2019/08/1111.jpg?resize=1024,683" },
                    { title: "Silent Echo", artist: "Marcus Thorne", img: "https://cyclingindependent.com/wp-content/uploads/2022/11/RUR-Shape-4-750x430.jpg" }
                 ].map((art, i) => (
                     <Card key={i} className="overflow-hidden shadow-subtle group hover:shadow-md transition-all">
                        <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                             <img src={art.img} alt={art.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-serif text-lg font-medium">{art.title}</h3>
                            <p className="text-sm text-muted-foreground">{art.artist}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                            <Button variant="outline" size="sm" className="w-full mr-2">Buy Keep</Button>
                            <Button variant="ghost" size="icon"><RotateCcw className="h-4 w-4" /></Button>
                        </CardFooter>
                     </Card>
                 ))}

                 {/* Next Box Promo */}
                 <Card className="bg-primary/5 border-dashed border-2 border-primary/20 flex flex-col items-center justify-center p-6 text-center h-full min-h-[300px]">
                     <Package className="h-12 w-12 text-primary/50 mb-4" />
                     <h3 className="font-serif text-lg font-medium mb-2">Next Box Preparing</h3>
                     <p className="text-sm text-muted-foreground mb-4">Curators are selecting your next pieces based on your refreshed preferences.</p>
                     <Button variant="default" onClick={() => setActiveTab("taste")}>Update Preferences</Button>
                 </Card>
              </div>
            </section>

            {/* Return Guide */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        Return Process
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">1</div>
                            <p>Pack artworks safely in the reusable Canvas Club box provided.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">2</div>
                            <p>Attach the pre-paid InPost label included in your welcome pack.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-full text-primary font-bold w-8 h-8 flex items-center justify-center shrink-0">3</div>
                            <p>Drop off at any of the 5,000+ InPost lockers nationwide.</p>
                        </div>
                    </div>
                    <Button variant="link" className="mt-4 p-0 h-auto text-primary">Find nearest locker <ChevronRight className="h-4 w-4" /></Button>
                </CardContent>
            </Card>

            {/* Extras */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute inset-0 z-0 opacity-40">
                         <img src="https://images.unsplash.com/photo-1573221566340-81bdde00e00b" className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="relative z-10 p-8 flex flex-col h-full justify-between">
                        <div>
                            <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-0 mb-4">Exclusive Member Invite</Badge>
                            <h3 className="text-2xl font-serif font-bold mb-2">Modern Perspectives Night</h3>
                            <p className="text-slate-200">Join us for drinks and private viewing at the Tate Modern.</p>
                        </div>
                        <div className="mt-8 flex gap-4 text-sm">
                            <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> May 12th</div>
                            <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> London</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                     <CardHeader>
                         <CardTitle className="flex items-center justify-between">
                             <span>Student Artist of the Month</span>
                             <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                         </CardTitle>
                     </CardHeader>
                     <div className="flex gap-4 p-6 pt-0">
                         <img src="https://images.unsplash.com/photo-1500964757637-c85e8a162699" className="w-24 h-24 object-cover rounded-md" />
                         <div>
                             <h4 className="font-bold">Leo Martinez</h4>
                             <p className="text-sm text-muted-foreground mb-2">Royal College of Art</p>
                             <p className="text-sm line-clamp-2">"My work explores the intersection of digital noise and organic silence..."</p>
                             <Button variant="link" className="p-0 h-auto mt-1">Read full profile</Button>
                         </div>
                     </div>
                </Card>
            </div>
          </TabsContent>

          <TabsContent value="taste">
             <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-serif mb-2">Your Taste Profile</h2>
                        <p className="text-muted-foreground">We use this to curate your quarterly boxes.</p>
                    </div>
                    {!isEditingPreferences ? (
                        <Button onClick={() => setIsEditingPreferences(true)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Refine Taste
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                             <Button variant="outline" onClick={() => {
                                 setIsEditingPreferences(false)
                                 setEditedPreferences({ // Reset
                                    mainStyles: userData.preferences.mainStyles,
                                    subStyles: userData.preferences.subStyles
                                 })
                             }}>Cancel</Button>
                             <Button onClick={handleSavePreferences} disabled={saveStatus === "saving"}>
                                 {saveStatus === "saving" ? "Saving..." : "Save Changes"}
                             </Button>
                        </div>
                    )}
                </div>

                {saveStatus === "success" && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your preferences have been updated!</AlertDescription>
                    </Alert>
                )}

                {isEditingPreferences ? (
                    <Card>
                        <CardContent className="pt-6">
                            <StyleSelector
                                selectedStyles={editedPreferences.mainStyles}
                                selectedSubStyles={editedPreferences.subStyles}
                                onToggleStyle={(style) => {
                                    const styles = [...editedPreferences.mainStyles]
                                    const index = styles.indexOf(style)
                                    if (index > -1) styles.splice(index, 1)
                                    else styles.push(style)
                                    setEditedPreferences({ ...editedPreferences, mainStyles: styles })
                                }}
                                onToggleSubStyle={(subStyle) => {
                                    const subs = [...editedPreferences.subStyles]
                                    const index = subs.indexOf(subStyle)
                                    if (index > -1) subs.splice(index, 1)
                                    else subs.push(subStyle)
                                    setEditedPreferences({ ...editedPreferences, subStyles: subs })
                                }}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Selected Styles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {userData.preferences?.mainStyles?.map((style: string) => (
                                        <Badge key={style} className="text-base py-1 px-3">{style}</Badge>
                                    ))}
                                    {userData.preferences?.subStyles?.map((style: string) => (
                                        <Badge key={style} variant="outline" className="text-base py-1 px-3">{style}</Badge>
                                    ))}
                                    {(!userData.preferences?.mainStyles?.length) && <p className="text-muted-foreground">No styles selected yet.</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Artist Tiers & Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Plan</span>
                                    <Badge variant="secondary">{userData.subscription?.plan || "None"}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Artist Tier</span>
                                    <span>{userData.subscription?.artistTier || "Emerging"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Boxes Received</span>
                                    <span className="font-bold">4</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
             </div>
          </TabsContent>

          <TabsContent value="rewards">
              <Card>
                  <CardHeader>
                      <CardTitle>Member Rewards</CardTitle>
                      <CardDescription>Earn points for rating art and referring friends.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                      <Ticket className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">You have 450 points</h3>
                      <p className="text-muted-foreground mb-6">50 more points until your next free print!</p>
                      <Button>View Rewards Catalog</Button>
                  </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
