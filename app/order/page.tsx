"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function OrderPage() {
  const [mode, setMode] = useState("auto")
  const [artist, setArtist] = useState("")
  const [style, setStyle] = useState("")
  const [gallery, setGallery] = useState("")
  const [delivery, setDelivery] = useState("day")
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Order placed!")
  }
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-serif">Order Prints</h1>
      <form onSubmit={submit} className="space-y-6">
        <div className="space-y-2">
          <Label>How would you like to choose your prints?</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" value="auto" checked={mode === "auto"} onChange={() => setMode("auto")} />
              <span>Auto-curate using my preferences</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="manual" checked={mode === "manual"} onChange={() => setMode("manual")} />
              <span>Select by artist, style or gallery</span>
            </label>
          </div>
        </div>
        {mode === "manual" && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Any" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input id="style" value={style} onChange={e => setStyle(e.target.value)} placeholder="Any" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery">Gallery</Label>
              <Input id="gallery" value={gallery} onChange={e => setGallery(e.target.value)} placeholder="Any" />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label>Delivery Option</Label>
          <Select value={delivery} onValueChange={setDelivery}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Nominated day (free)</SelectItem>
              <SelectItem value="time">Specific time (+£5)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Place Order</Button>
      </form>
    </main>
  )
}
