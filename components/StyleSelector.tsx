"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Minus, Plus, Sparkles } from "lucide-react"
import { ART_STYLES, findSubStyle, type ArtImage } from "@/lib/art-data"

interface StyleSelectorProps {
  selectedStyles: string[] // style ids
  selectedSubStyles: string[] // sub-style ids
  onToggleStyle: (styleId: string) => void
  onToggleSubStyle: (subStyleId: string) => void
}

function Attribution({ image, className = "" }: { image: ArtImage; className?: string }) {
  return (
    <p className={`text-[11px] leading-snug text-muted-foreground ${className}`}>
      {image.artist} · {image.title}
    </p>
  )
}

export function StyleSelector({
  selectedStyles,
  selectedSubStyles,
  onToggleStyle,
  onToggleSubStyle,
}: StyleSelectorProps) {
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null)
  const activeStyle = ART_STYLES.find((s) => s.id === activeStyleId)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ART_STYLES.map((style) => {
          const isSelected = selectedStyles.includes(style.id)
          const selectedSubCount = style.subStyles.filter((sub) => selectedSubStyles.includes(sub.id)).length

          return (
            <div
              key={style.id}
              className={`flex flex-col rounded-xl border-2 transition-all duration-200 overflow-hidden bg-white ${
                isSelected ? "border-primary shadow-md" : "border-transparent shadow-sm hover:shadow-md"
              }`}
            >
              <button
                type="button"
                className="cursor-pointer group relative text-left"
                onClick={() => onToggleStyle(style.id)}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Deselect" : "Select"} ${style.name}`}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <Image
                    src={style.image.src}
                    alt={`${style.name} — ${style.image.title} by ${style.image.artist}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 transition-opacity duration-200 flex items-center justify-center ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {isSelected ? (
                      <div className="bg-primary text-primary-foreground rounded-full p-2 animate-in zoom-in">
                        <Check className="h-6 w-6" />
                      </div>
                    ) : (
                      <div className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2">
                        <Plus className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              </button>

              <div className="p-4 bg-card flex-1 flex flex-col justify-between gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-lg font-medium leading-none">{style.name}</h3>
                    <Attribution image={style.image} className="mt-1.5" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 gap-1 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => setActiveStyleId(style.id)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Explore
                  </Button>
                </div>
                {selectedSubCount > 0 && (
                  <p className="text-xs text-primary font-medium">
                    {selectedSubCount} sub-{selectedSubCount === 1 ? "genre" : "genres"} selected
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sub-genre explosion modal */}
      <Dialog open={!!activeStyleId} onOpenChange={(open) => !open && setActiveStyleId(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
          {activeStyle && (
            <>
              <DialogHeader className="p-6 pb-4 border-b shrink-0 bg-background z-10">
                <DialogTitle className="text-2xl font-serif">
                  Explore {activeStyle.name}
                </DialogTitle>
                <DialogDescription>{activeStyle.description} Pick the sub-genres you love.</DialogDescription>
              </DialogHeader>

              <div className="overflow-y-auto p-6 flex-1 bg-[#FAFAFA]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {activeStyle.subStyles.map((sub) => {
                    const isSubSelected = selectedSubStyles.includes(sub.id)
                    return (
                      <button
                        type="button"
                        key={sub.id}
                        className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 text-left bg-white ${
                          isSubSelected
                            ? "border-primary shadow-md ring-2 ring-primary/20"
                            : "border-transparent shadow-sm hover:shadow-md"
                        }`}
                        onClick={() => onToggleSubStyle(sub.id)}
                        aria-pressed={isSubSelected}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={sub.image.src}
                            alt={`${sub.name} — ${sub.image.title} by ${sub.image.artist}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover"
                          />
                          <div
                            className={`absolute inset-0 transition-colors duration-200 flex items-center justify-center ${
                              isSubSelected ? "bg-primary/20" : "bg-black/0 group-hover:bg-black/10"
                            }`}
                          >
                            {isSubSelected && (
                              <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-sm animate-in zoom-in">
                                <Check className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="p-3 border-t">
                          <p className={`font-medium ${isSubSelected ? "text-primary" : "text-foreground"}`}>
                            {sub.name}
                          </p>
                          <Attribution image={sub.image} className="mt-0.5" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <DialogFooter className="p-4 border-t bg-background shrink-0 sm:justify-between items-center">
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {activeStyle.subStyles.filter((s) => selectedSubStyles.includes(s.id)).length} selected
                </div>
                <Button onClick={() => setActiveStyleId(null)} className="w-full sm:w-auto">
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Selected sub-genre summary */}
      {selectedSubStyles.length > 0 && (
        <div className="p-4 bg-background rounded-lg border shadow-sm">
          <p className="text-sm font-medium mb-3">Your refined palette</p>
          <div className="flex flex-wrap gap-2">
            {selectedSubStyles.map((id) => {
              const match = findSubStyle(id)
              if (!match) return null
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="bg-secondary/50 text-xs pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {match.style.name} · {match.sub.name}
                  <button
                    type="button"
                    className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                    onClick={() => onToggleSubStyle(id)}
                    aria-label={`Remove ${match.sub.name}`}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
