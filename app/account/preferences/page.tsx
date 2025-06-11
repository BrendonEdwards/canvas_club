"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, ThumbsUp, ThumbsDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const artworks = [
  {
    id: 1,
    title: "Abstract Study",
    image:
      "https://m.media-amazon.com/images/I/51DjA2n+QYL._UXNaN_FMjpg_QL85_.jpg",
  },
  {
    id: 2,
    title: "Portrait Artist",
    image:
      "https://media.meer.com/attachments/823e3abf8cd5ca97690888cf8e21b3ee0e7ef2a1/store/fill/860/645/67568b9166ef3f4eef54cc259f1951f7a178342cdfaa41fbfad508cff067/Girl-with-a-Pearl-Earring-is-an-oil-painting-by-Dutch-Golden-Age-painter-Johannes-Vermeer-dated.jpg",
  },
]

export default function PreferencesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [ratings, setRatings] = useState<{ [id: number]: string }>({})
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  const rate = (id: number, value: string) => {
    setRatings({ ...ratings, [id]: value })
  }

  const save = async () => {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user, ratings }),
    })
    setMessage("Preferences saved")
  }

  if (!user) return null

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-3xl font-serif">Refine Your Taste</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {artworks.map((art) => (
          <Card key={art.id} className="overflow-hidden">
            <CardHeader className="p-2 text-center text-sm font-medium">
              {art.title}
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-2">
              <img src={art.image} alt="" className="h-40 w-full object-cover" />
              <div className="flex gap-4">
                <Button
                  size="icon"
                  variant={ratings[art.id] === "like" ? "default" : "outline"}
                  onClick={() => rate(art.id, "like")}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={ratings[art.id] === "love" ? "default" : "outline"}
                  onClick={() => rate(art.id, "love")}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={ratings[art.id] === "dislike" ? "default" : "outline"}
                  onClick={() => rate(art.id, "dislike")}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button onClick={save}>Save preferences</Button>
      {message && <p className="text-sm text-green-600">{message}</p>}
    </main>
  )
}
