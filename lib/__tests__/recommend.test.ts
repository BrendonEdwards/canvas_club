import { describe, it, expect } from "vitest"
import { recommend } from "@/lib/recommend"
import { emptyPreferences } from "@/lib/types"

describe("recommend", () => {
  it("returns a cold-start list for empty preferences", () => {
    const recs = recommend(emptyPreferences())
    expect(recs.length).toBe(6)
  })

  it("ranks a loved style with a selected sub-genre first", () => {
    const recs = recommend({
      mainStyles: ["cubism"],
      subStyles: ["analytical-cubism"],
      ratings: { cubism: "love" },
    })
    expect(recs[0].styleId).toBe("cubism")
    expect(recs[0].subStyleId).toBe("analytical-cubism")
  })

  it("pushes disliked styles out of the top results", () => {
    const recs = recommend({
      mainStyles: ["landscape", "portrait"],
      subStyles: [],
      ratings: { cubism: "dislike", landscape: "love" },
    })
    expect(recs.slice(0, 4).every((r) => r.styleId !== "cubism")).toBe(true)
    expect(recs[0].styleId).toBe("landscape")
  })

  it("respects the limit parameter", () => {
    expect(recommend(emptyPreferences(), 3).length).toBe(3)
  })
})
