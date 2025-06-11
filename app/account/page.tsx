"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import RatingInterface, { Artwork } from "@/components/rating-interface"
import { useAuth } from "@/hooks/use-auth"

const sampleArtworks: Artwork[] = [
  {
    id: 0,
    style: "Abstract",
    artist: "Contemporary Abstract Artist",
    image: "https://m.media-amazon.com/images/I/51DjA2n+QYL._UXNaN_FMjpg_QL85_.jpg",
  },
  {
    id: 1,
    style: "Black & White",
    artist: "Monochrome Photographer",
    image: "https://cyclingindependent.com/wp-content/uploads/2022/11/RUR-Shape-4-750x430.jpg",
  },
  {
    id: 2,
    style: "Contemporary",
    artist: "Modern Studio",
    image: "https://redtreetimes.com/wp-content/uploads/2016/10/yayoi-kusama-all-the-eternal-love-i-have-for-the-pumpkins-2016.jpg?w=768",
  },
  {
    id: 3,
    style: "Cubism",
    artist: "Cubist Master",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg/330px-Pablo_Picasso,_1909,_Brick_Factory_at_Tortosa,_oil_on_canvas,_50.7_x_60.2_cm,_The_State_Hermitage_Museum,_Saint_Petersburg.jpg",
  },
  {
    id: 4,
    style: "Digital Art",
    artist: "Digital Creator",
    image: "https://cdn.inprnt.com/thumbs/11/b8/11b8120923b29073a19d2d8564228b3a.jpg",
  },
]

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setEmail(user)
      const storedName = localStorage.getItem("userName") || ""
      setName(storedName)
    }
  }, [user, router])

  const save = () => {
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)
    setMessage("Account updated")
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-12">
      <section className="space-y-6">
        <h1 className="text-3xl font-serif">Your Account</h1>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif">Refine Your Taste</h2>
        <RatingInterface artworks={sampleArtworks} />
      </section>
    </main>
  )
}
