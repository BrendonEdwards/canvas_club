"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"

export default function OrderPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState("auto")
  const [artist, setArtist] = useState("")
  const [style, setStyle] = useState("")
  const [gallery, setGallery] = useState("")
  const [date, setDate] = useState("")
  const [timed, setTimed] = useState(false)

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Order placed!")
  }

  if (!user) return null

  return (
    <main className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-3xl font-serif">Order Prints</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mode">How would you like to choose art?</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger id="mode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatically curate</SelectItem>
              <SelectItem value="manual">Select by artist/style/gallery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {mode === "manual" && (
          <div className="space-y-2">
            <Input
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
            <Input placeholder="Style" value={style} onChange={(e) => setStyle(e.target.value)} />
            <Input
              placeholder="Gallery"
              value={gallery}
              onChange={(e) => setGallery(e.target.value)}
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="date">Delivery date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="timed" checked={timed} onCheckedChange={() => setTimed(!timed)} />
          <Label htmlFor="timed">Add £5 for a timed slot</Label>
        </div>
        <Button type="submit">Place order</Button>
      </form>
    </main>
  )
}
