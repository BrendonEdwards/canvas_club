"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react"

import { useTaste } from "@/contexts/taste-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type GalleryRecommendation = {
  id: string
  title: string
  artist: string
  image: string
  style?: string
}

export type GalleryRecommendationsProps = {
  initialRecommendations?: GalleryRecommendation[]
}

const DEFAULT_RECOMMENDATIONS: GalleryRecommendation[] = [
  {
    id: "Abstract Horizon",
    title: "Abstract Horizon",
    artist: "Amelia Cross",
    style: "Abstract",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "Neon City",
    title: "Neon City",
    artist: "Kai Morgan",
    style: "Urban",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "Serene Coast",
    title: "Serene Coast",
    artist: "Harper Ellis",
    style: "Landscape",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
]

export function GalleryRecommendations({ initialRecommendations }: GalleryRecommendationsProps) {
  const fallbackRecommendations = useMemo(
    () => (initialRecommendations && initialRecommendations.length > 0 ? initialRecommendations : DEFAULT_RECOMMENDATIONS),
    [initialRecommendations],
  )
  const { updateFeedback, tasteSeed } = useTaste()
  const [recommendations, setRecommendations] = useState<GalleryRecommendation[]>(fallbackRecommendations)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setRecommendations(fallbackRecommendations)
    setActiveIndex(0)
  }, [fallbackRecommendations])

  const fetchRecommendations = useCallback(
    async (seed: string, signal?: AbortSignal) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        params.set("tasteSeed", seed)
        const response = await fetch(`/api/recommendations?${params.toString()}`, { signal })
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }
        const payload = await response.json()
        if (Array.isArray(payload?.recommendations) && payload.recommendations.length > 0) {
          setRecommendations(payload.recommendations)
          setActiveIndex(0)
        } else {
          setRecommendations(fallbackRecommendations)
        }
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return
        }
        setRecommendations((current) => (current.length > 0 ? current : fallbackRecommendations))
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [fallbackRecommendations],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchRecommendations(tasteSeed, controller.signal)
    return () => controller.abort()
  }, [tasteSeed, fetchRecommendations])

  const activeRecommendation = recommendations[activeIndex]

  const goToNext = useCallback(() => {
    setActiveIndex((index) => {
      if (recommendations.length === 0) return 0
      return (index + 1) % recommendations.length
    })
  }, [recommendations.length])

  const handleFeedback = useCallback(
    (value: "like" | "dislike") => {
      if (!activeRecommendation) return
      updateFeedback(activeRecommendation.id, value)
      goToNext()
    },
    [activeRecommendation, updateFeedback, goToNext],
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Gallery Recommendations</CardTitle>
        <CardDescription>
          React to each piece and we will instantly refine the next rotation using your personalised taste seed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeRecommendation ? (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
              <Image
                src={activeRecommendation.image}
                alt={activeRecommendation.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 400px, 100vw"
                priority
              />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{activeRecommendation.title}</p>
                <p className="text-sm text-muted-foreground">{activeRecommendation.artist}</p>
              </div>
              {activeRecommendation.style && <Badge>{activeRecommendation.style}</Badge>}
            </div>
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            We&apos;re sourcing new artworks for you...
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            onClick={() => handleFeedback("like")}
            disabled={!activeRecommendation || isLoading}
          >
            <ThumbsUp className="mr-2 h-4 w-4" aria-hidden="true" />
            {activeRecommendation ? `Like "${activeRecommendation.title}"` : "Like"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFeedback("dislike")}
            disabled={!activeRecommendation || isLoading}
          >
            <ThumbsDown className="mr-2 h-4 w-4" aria-hidden="true" />
            {activeRecommendation ? `Dislike "${activeRecommendation.title}"` : "Dislike"}
          </Button>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Updating recommendations…
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
