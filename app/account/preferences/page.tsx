"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { TasteProvider, useTaste } from "@/contexts/taste-context"
import { GalleryRecommendations, type GalleryRecommendation } from "@/components/gallery/gallery-recommendations"
import { TasteSummary } from "@/components/taste-summary"

const STARTER_GALLERY: GalleryRecommendation[] = [
  {
    id: "abstract-study",
    title: "Abstract Study",
    artist: "Lena Ortiz",
    style: "Abstract",
    image: "https://m.media-amazon.com/images/I/51DjA2n+QYL._UXNaN_FMjpg_QL85_.jpg",
  },
  {
    id: "portrait-artist",
    title: "Portrait Artist",
    artist: "Ravi Sethi",
    style: "Portrait",
    image:
      "https://media.meer.com/attachments/823e3abf8cd5ca97690888cf8e21b3ee0e7ef2a1/store/fill/860/645/67568b9166ef3f4eef54cc259f1951f7a178342cdfaa41fbfad508cff067/Girl-with-a-Pearl-Earring-is-an-oil-painting-by-Dutch-Golden-Age-painter-Johannes-Vermeer-dated.jpg",
  },
  {
    id: "coastal-dream",
    title: "Coastal Dream",
    artist: "Harper Ellis",
    style: "Landscape",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg/1200px-Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg",
  },
  {
    id: "surreal-batman",
    title: "Surreal Ironing",
    artist: "Maya Noor",
    style: "Surrealism",
    image: "https://jimmoir.com/wp-content/uploads/2024/12/Batman-Ironing.jpg",
  },
]

export default function PreferencesPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  if (!user) return null

  return (
    <TasteProvider>
      <TastePreferencesContent email={user} />
    </TasteProvider>
  )
}

type TastePreferencesContentProps = {
  email: string
}

function TastePreferencesContent({ email }: TastePreferencesContentProps) {
  const router = useRouter()
  const { feedback, likes, dislikes } = useTaste()
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const save = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ratings: feedback,
          taste: {
            likes,
            dislikes,
          },
        }),
      })
      setMessage("Preferences saved")
      // Redirect back to account overview for convenience
      router.prefetch("/account")
    } catch (error) {
      setMessage("We couldn’t save your preferences. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-3xl font-serif">Refine Your Taste</h1>
        <p className="text-muted-foreground">
          Tell us what speaks to you. Your live feedback updates the gallery and your personalised summary instantly.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GalleryRecommendations initialRecommendations={STARTER_GALLERY} />
        <TasteSummary />
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium">Happy with these preferences?</p>
            <p className="text-sm text-muted-foreground">
              Saving locks in your current likes and dislikes so we can start curating your next delivery.
            </p>
          </div>
          <Button type="button" onClick={save} disabled={isSaving} className="min-w-[180px]">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Saving taste profile
              </span>
            ) : (
              "Save taste profile"
            )}
          </Button>
        </CardContent>
      </Card>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </main>
  )
}
