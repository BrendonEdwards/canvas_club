import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import { TasteProvider } from "@/contexts/taste-context"
import { GalleryRecommendations, type GalleryRecommendation } from "@/components/gallery/gallery-recommendations"
import { TasteSummary } from "@/components/taste-summary"

const SAMPLE_RECOMMENDATIONS: GalleryRecommendation[] = [
  {
    id: "abstract-horizon",
    title: "Abstract Horizon",
    artist: "Amelia Cross",
    style: "Abstract",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "neon-city",
    title: "Neon City",
    artist: "Kai Morgan",
    style: "Urban",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
]

const originalFetch = globalThis.fetch

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  globalThis.fetch = originalFetch
  vi.restoreAllMocks()
})

test("summary updates and recommendations refetch with new taste seed", async () => {
  const fetchSpy = vi.fn().mockImplementation(async () => ({
    ok: true,
    json: async () => ({ recommendations: SAMPLE_RECOMMENDATIONS }),
  }))
  globalThis.fetch = fetchSpy as unknown as typeof fetch

  render(
    <TasteProvider>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GalleryRecommendations initialRecommendations={SAMPLE_RECOMMENDATIONS} />
        <TasteSummary />
      </div>
    </TasteProvider>,
  )

  await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))

  const seeds = fetchSpy.mock.calls.map(([url]) =>
    new URL(url as string, "https://example.com").searchParams.get("tasteSeed"),
  )
  expect(seeds[0]).toBe("neutral")

  const user = userEvent.setup()

  const likeButton = await screen.findByRole("button", { name: /Like "Abstract Horizon"/i })
  await user.click(likeButton)

  await waitFor(() => expect(screen.getByLabelText(/liked count/i)).toHaveTextContent("1"))

  await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2))

  const updatedSeeds = fetchSpy.mock.calls.map(([url]) =>
    new URL(url as string, "https://example.com").searchParams.get("tasteSeed"),
  )
  expect(updatedSeeds[1]).toBe('{"like":["abstract-horizon"],"dislike":[]}')

  const dislikeButton = await screen.findByRole("button", { name: /Dislike "Neon City"/i })
  await user.click(dislikeButton)

  await waitFor(() => expect(screen.getByLabelText(/disliked count/i)).toHaveTextContent("1"))
  await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(3))

  const finalSeeds = fetchSpy.mock.calls.map(([url]) =>
    new URL(url as string, "https://example.com").searchParams.get("tasteSeed"),
  )
  expect(finalSeeds[2]).toBe('{"like":["abstract-horizon"],"dislike":["neon-city"]}')
})
