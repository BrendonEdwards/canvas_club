"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Star } from "lucide-react"
import { RATING_DECK } from "@/lib/art-data"
import type { Rating } from "@/lib/types"
import type { WizardState } from "./use-wizard-state"

const ratingButtons: { rating: Rating; label: string; emoji: string; classes: string }[] = [
  { rating: "dislike", label: "Dislike", emoji: "👎", classes: "border-red-200 text-red-600 hover:bg-red-50" },
  { rating: "like", label: "Like", emoji: "👍", classes: "border-green-200 text-green-600 hover:bg-green-50" },
  { rating: "love", label: "Love", emoji: "❤️", classes: "border-purple-200 text-purple-600 hover:bg-purple-50" },
]

export function RatingsStep({ wizard }: { wizard: WizardState }) {
  const { form, errors, rate, undoRate, ratingOrder, ratedCount, ratingComplete } = wizard

  const current = RATING_DECK.find((artwork) => !(artwork.id in form.ratings))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === "1") rate(current.id, "dislike")
      else if (e.key === "2") rate(current.id, "like")
      else if (e.key === "3") rate(current.id, "love")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [current, rate])

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-3">
        <CardTitle className="flex items-center gap-3 text-2xl font-serif">
          <Star className="h-6 w-6 text-primary" />
          Refine Your Taste
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          Rate one work from each style. Your ratings — with your selected styles — shape every box we curate for you.
        </CardDescription>
      </div>

      {errors.ratings && (
        <Alert variant="destructive" className="rounded-lg shadow-subtle">
          <AlertDescription>{errors.ratings}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center space-y-6">
        {/* Progress */}
        <div className="w-full max-w-md">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>
              {Math.min(ratedCount + 1, RATING_DECK.length)} of {RATING_DECK.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(ratedCount / RATING_DECK.length) * 100}%` }}
            />
          </div>
        </div>

        {ratingComplete || !current ? (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-primary mx-auto" />
            <h3 className="text-xl font-serif">Perfect! We've got a good sense of your style.</h3>
            <p className="text-muted-foreground">
              Based on your ratings, we'll curate artwork that matches your taste.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">
              Use the buttons or keys <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>
            </p>

            {/* Artwork card */}
            <div className="w-full max-w-md">
              <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={current.image.src}
                    alt={`${current.image.title} by ${current.image.artist}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-6 space-y-1 text-center">
                  <h3 className="font-serif text-xl font-medium">{current.image.title}</h3>
                  <p className="text-muted-foreground">
                    {current.image.artist} · {current.styleName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {ratingButtons.map(({ rating, label, emoji, classes }) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="lg"
                  onClick={() => rate(current.id, rating)}
                  className={`px-8 py-4 ${classes}`}
                >
                  <span className="text-2xl mr-2">{emoji}</span>
                  {label}
                </Button>
              ))}
            </div>
          </>
        )}

        {ratingOrder.length > 0 && (
          <Button variant="ghost" onClick={undoRate} className="text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Undo last rating
          </Button>
        )}
      </div>
    </div>
  )
}
