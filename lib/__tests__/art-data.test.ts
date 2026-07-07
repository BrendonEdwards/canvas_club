import { describe, it, expect } from "vitest"
import fs from "fs"
import path from "path"
import { ART_STYLES, RATING_DECK, findStyle, findSubStyle } from "@/lib/art-data"

const allImages = ART_STYLES.flatMap((s) => [s.image, ...s.subStyles.map((sub) => sub.image)])

describe("art data", () => {
  it("serves every image locally from /art/", () => {
    for (const img of allImages) {
      expect(img.src.startsWith("/art/")).toBe(true)
    }
  })

  it("has every image file on disk", () => {
    for (const img of allImages) {
      const file = path.join(process.cwd(), "public", img.src)
      expect(fs.existsSync(file), `missing ${img.src}`).toBe(true)
      expect(fs.statSync(file).size).toBeGreaterThan(5000)
    }
  })

  it("carries attribution on every image", () => {
    for (const img of allImages) {
      expect(img.artist.length).toBeGreaterThan(0)
      expect(img.title.length).toBeGreaterThan(0)
      expect(img.license.length).toBeGreaterThan(0)
    }
  })

  it("has unique style and sub-style ids", () => {
    const ids = ART_STYLES.flatMap((s) => [s.id, ...s.subStyles.map((sub) => sub.id)])
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("builds a rating deck with one entry per style", () => {
    expect(RATING_DECK.length).toBe(ART_STYLES.length)
  })

  it("resolves styles and sub-styles by id", () => {
    expect(findStyle("cubism")?.name).toBe("Cubism")
    expect(findSubStyle("analytical-cubism")?.style.id).toBe("cubism")
    expect(findSubStyle("nope")).toBeNull()
  })
})
