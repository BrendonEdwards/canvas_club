"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Minus, Package, Plus, PlusCircle } from "lucide-react"
import { ART_STYLES, findStyle, findSubStyle } from "@/lib/art-data"
import { GALLERY_HUBS } from "@/lib/galleries"
import { formatGBP } from "@/lib/pricing"
import type { GalleryPrint } from "@/lib/types"

const emptyDraft = {
  title: "",
  artist: "",
  styleId: "",
  subStyleId: "",
  sizes: [] as string[],
  stockCount: "1",
  retailPrice: "",
}

export default function PartnerPage() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [prints, setPrints] = useState<GalleryPrint[]>([])
  const [fetched, setFetched] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch("/api/partner/prints")
    if (res.ok) {
      const data = await res.json()
      setPrints(data.prints ?? [])
    }
    setFetched(true)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "gallery") {
      router.push("/dashboard")
      return
    }
    load()
  }, [user, loading, router, load])

  const patchPrint = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/partner/prints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updated = await res.json()
      setPrints((prev) => prev.map((p) => (p.id === id ? updated : p)))
    }
  }

  const addPrint = async () => {
    setSaving(true)
    setError("")
    const res = await fetch("/api/partner/prints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    })
    if (res.ok) {
      const created = await res.json()
      setPrints((prev) => [created, ...prev])
      setDraft(emptyDraft)
      setDialogOpen(false)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Could not add the print")
    }
    setSaving(false)
  }

  if (loading || !user || user.role !== "gallery") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading partner portal…</p>
      </div>
    )
  }

  const hub = GALLERY_HUBS.find((h) => h.id === user.galleryId)
  const galleryName = hub?.name ?? user.name
  const listedCount = prints.filter((p) => p.status === "listed").length
  const totalStock = prints.reduce((sum, p) => sum + p.stockCount, 0)
  const lowStock = prints.filter((p) => p.status === "listed" && p.stockCount <= 2).length
  const styleForDraft = findStyle(draft.styleId)

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-primary">Canvas Club</h1>
            <p className="text-xs text-muted-foreground -mt-0.5">Partner portal</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium hidden md:inline">{galleryName}</span>
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

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Listed prints", value: listedCount },
            { label: "Total stock", value: totalStock },
            { label: "Low stock (≤2)", value: lowStock },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="py-5">
                <p className="text-3xl font-serif font-bold">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="font-serif text-xl">Your prints in circulation</CardTitle>
              <CardDescription>
                Stock counts drive curation: members are only matched to works you actually have.
              </CardDescription>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add print
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-serif">Add a print</DialogTitle>
                  <DialogDescription>
                    List an edition from your stock for Canvas Club rotation.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="p-title">Title</Label>
                      <Input
                        id="p-title"
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-artist">Artist</Label>
                      <Input
                        id="p-artist"
                        value={draft.artist}
                        onChange={(e) => setDraft({ ...draft, artist: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Style</Label>
                      <Select
                        value={draft.styleId}
                        onValueChange={(v) => setDraft({ ...draft, styleId: v, subStyleId: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a style" />
                        </SelectTrigger>
                        <SelectContent>
                          {ART_STYLES.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Sub-genre (optional)</Label>
                      <Select
                        value={draft.subStyleId}
                        onValueChange={(v) => setDraft({ ...draft, subStyleId: v })}
                        disabled={!styleForDraft}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={styleForDraft ? "Choose" : "Pick a style first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {styleForDraft?.subStyles.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
                    <div className="space-y-2">
                      <Label>Sizes</Label>
                      <div className="flex gap-4 pt-1.5">
                        {["A3", "A2"].map((size) => (
                          <label key={size} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={draft.sizes.includes(size)}
                              onCheckedChange={(checked) =>
                                setDraft({
                                  ...draft,
                                  sizes:
                                    checked === true
                                      ? [...draft.sizes, size]
                                      : draft.sizes.filter((s) => s !== size),
                                })
                              }
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-stock">Stock</Label>
                      <Input
                        id="p-stock"
                        type="number"
                        min={0}
                        value={draft.stockCount}
                        onChange={(e) => setDraft({ ...draft, stockCount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="p-price">Buy-to-keep £</Label>
                      <Input
                        id="p-price"
                        type="number"
                        min={0}
                        step="0.01"
                        value={draft.retailPrice}
                        onChange={(e) => setDraft({ ...draft, retailPrice: e.target.value })}
                        placeholder="e.g. 120"
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter>
                  <Button onClick={addPrint} disabled={saving}>
                    {saving ? "Adding…" : "Add to catalogue"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {fetched && prints.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-10 w-10 mx-auto mb-3 text-primary/40" />
                <p className="font-medium text-foreground">No prints listed yet</p>
                <p className="text-sm mt-1">
                  Add your first edition and it becomes available to the curation engine.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {prints.map((print) => (
                  <div key={print.id} className="py-4 flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-medium leading-tight">{print.title}</p>
                      <p className="text-sm text-muted-foreground">{print.artist}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                          {findStyle(print.styleId)?.name ?? print.styleId}
                        </Badge>
                        {print.subStyleId && (
                          <Badge variant="secondary" className="text-xs">
                            {findSubStyle(print.subStyleId)?.sub.name ?? print.subStyleId}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {print.sizes.join(" · ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-sm text-right min-w-[90px]">
                      <p className="text-muted-foreground">Buy-to-keep</p>
                      <p className="font-medium">{formatGBP(print.retailPrice)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Decrease stock"
                        disabled={print.stockCount <= 0}
                        onClick={() => patchPrint(print.id, { stockCount: print.stockCount - 1 })}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span
                        className={`w-8 text-center font-medium ${
                          print.stockCount <= 2 ? "text-red-600" : ""
                        }`}
                      >
                        {print.stockCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Increase stock"
                        onClick={() => patchPrint(print.id, { stockCount: print.stockCount + 1 })}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <Button
                      variant={print.status === "listed" ? "secondary" : "default"}
                      size="sm"
                      className="min-w-[84px]"
                      onClick={() =>
                        patchPrint(print.id, { status: print.status === "listed" ? "unlisted" : "listed" })
                      }
                    >
                      {print.status === "listed" ? "Unlist" : "List"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Weekly pick lists and shipping labels arrive by email during the pilot. Royalty statements follow at
          month end.
        </p>
      </main>
    </div>
  )
}
