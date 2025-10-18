"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

export type TasteFeedbackValue = "like" | "dislike"
export type TasteFeedbackMap = Record<string, TasteFeedbackValue>

export type TasteContextValue = {
  feedback: TasteFeedbackMap
  likes: string[]
  dislikes: string[]
  tasteSeed: string
  updateFeedback: (id: string, value: TasteFeedbackValue | null) => void
  reset: () => void
}

const TasteContext = createContext<TasteContextValue | undefined>(undefined)

export type TasteProviderProps = {
  children: ReactNode
  initialFeedback?: TasteFeedbackMap
}

export function TasteProvider({ children, initialFeedback }: TasteProviderProps) {
  const [feedback, setFeedback] = useState<TasteFeedbackMap>(initialFeedback ?? {})

  const updateFeedback = useCallback((id: string, value: TasteFeedbackValue | null) => {
    setFeedback((prev) => {
      const next = { ...prev }
      if (value === null) {
        delete next[id]
        return next
      }
      if (next[id] === value) {
        // Toggle off when the same value is selected again to allow re-rating later
        delete next[id]
        return next
      }
      next[id] = value
      return next
    })
  }, [])

  const reset = useCallback(() => setFeedback({}), [])

  const likes = useMemo(() => Object.entries(feedback).filter(([, value]) => value === "like").map(([id]) => id), [feedback])
  const dislikes = useMemo(
    () => Object.entries(feedback).filter(([, value]) => value === "dislike").map(([id]) => id),
    [feedback],
  )

  const tasteSeed = useMemo(() => {
    if (likes.length === 0 && dislikes.length === 0) return "neutral"
    const payload = {
      like: [...likes].sort(),
      dislike: [...dislikes].sort(),
    }
    return JSON.stringify(payload)
  }, [likes, dislikes])

  const value = useMemo(
    () => ({
      feedback,
      likes,
      dislikes,
      tasteSeed,
      updateFeedback,
      reset,
    }),
    [feedback, likes, dislikes, tasteSeed, updateFeedback, reset],
  )

  return <TasteContext.Provider value={value}>{children}</TasteContext.Provider>
}

export function useTaste(optional?: false): TasteContextValue
export function useTaste(optional: true): TasteContextValue | undefined
export function useTaste(optional = false) {
  const context = useContext(TasteContext)
  if (!context && !optional) {
    throw new Error("useTaste must be used within a TasteProvider")
  }
  return context
}

export function useTasteSnapshot() {
  const context = useTaste(true)
  return {
    likes: context?.likes ?? [],
    dislikes: context?.dislikes ?? [],
    tasteSeed: context?.tasteSeed ?? "neutral",
  }
}
