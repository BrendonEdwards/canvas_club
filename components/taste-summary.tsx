"use client"

import { useMemo } from "react"
import { useTasteSnapshot } from "@/contexts/taste-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export type TasteSummarySnapshot = {
  likes: string[]
  dislikes: string[]
}

export type TasteSummaryProps = {
  taste?: TasteSummarySnapshot
}

export function TasteSummary({ taste }: TasteSummaryProps) {
  const contextSnapshot = useTasteSnapshot()
  const snapshot = useMemo(() => {
    if (taste) {
      return {
        likes: [...taste.likes],
        dislikes: [...taste.dislikes],
      }
    }
    return {
      likes: [...contextSnapshot.likes],
      dislikes: [...contextSnapshot.dislikes],
    }
  }, [taste, contextSnapshot.likes, contextSnapshot.dislikes])

  const hasFeedback = snapshot.likes.length + snapshot.dislikes.length > 0

  return (
    <Card aria-live="polite">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Taste Summary</CardTitle>
        <CardDescription>Track how your feedback shapes future gallery rotations.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-center">
            <p className="font-semibold">Liked works</p>
            <p aria-label="liked count" className="text-2xl font-bold">
              {snapshot.likes.length}
            </p>
          </div>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-center">
            <p className="font-semibold">Disliked works</p>
            <p aria-label="disliked count" className="text-2xl font-bold">
              {snapshot.dislikes.length}
            </p>
          </div>
        </div>
        {hasFeedback ? (
          <div className="space-y-3 text-sm">
            {snapshot.likes.length > 0 && (
              <div>
                <p className="font-medium">Favourites</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {snapshot.likes.map((id) => (
                    <li key={`like-${id}`}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
            {snapshot.dislikes.length > 0 && (
              <div>
                <p className="font-medium">Less preferred</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {snapshot.dislikes.map((id) => (
                    <li key={`dislike-${id}`}>{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Provide a few more reactions in the gallery to personalise your future deliveries.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
