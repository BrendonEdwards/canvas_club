"use client"

 nqyrrk-codex/add-login-page-for-registration
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

export default function OrderPage() {

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
 main
  const [mode, setMode] = useState("auto")
  const [artist, setArtist] = useState("")
  const [style, setStyle] = useState("")
  const [gallery, setGallery] = useState("")
 nqyrrk-codex/add-login-page-for-registration
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
 main
      </form>
    </main>
  )
}
