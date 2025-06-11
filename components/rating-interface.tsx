"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

export interface Artwork {
  id: number
  style: string
  artist: string
  image: string
}

interface Props {
  artworks: Artwork[]
  onComplete?: (ratings: Record<number, string>) => void
}

export default function RatingInterface({ artworks, onComplete }: Props) {
  const [index, setIndex] = useState(0)
  const [history, setHistory] = useState<{ id: number; rating: string }[]>([])

  const rate = (rating: string) => {
    const art = artworks[index]
    setHistory([...history, { id: art.id, rating }])
    if (index + 1 < artworks.length) {
      setIndex(index + 1)
    } else {
      onComplete?.(Object.fromEntries([...history, { id: art.id, rating }].map(h => [h.id, h.rating])))
    }
  }

  const undo = () => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(history.slice(0, -1))
    setIndex(artworks.findIndex(a => a.id === last.id))
  }

  if (index >= artworks.length) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="mx-auto h-12 w-12 text-primary" />
        <p className="font-serif text-xl">Thanks for refining your taste!</p>
        {history.length > 0 && (
          <Button variant="ghost" onClick={undo} className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />Undo last rating
          </Button>
        )}
      </div>
    )
  }

  const art = artworks[index]

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <img src={art.image} alt={art.style} className="mx-auto rounded-lg object-cover w-64 h-64" />
        <h3 className="font-serif text-xl">{art.style}</h3>
        <p className="text-muted-foreground">{art.artist}</p>
      </div>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => rate("dislike")}>👎</Button>
        <Button variant="outline" onClick={() => rate("like")}>👍</Button>
        <Button variant="outline" onClick={() => rate("love")}>❤️</Button>
      </div>
      {history.length > 0 && (
        <Button variant="ghost" onClick={undo} className="text-primary hover:bg-primary/10">
          <ArrowLeft className="h-4 w-4 mr-2" />Undo last rating
        </Button>
      )}
      <p className="text-sm text-muted-foreground">
        {index + 1} of {artworks.length}
      </p>
    </div>
  )
}
