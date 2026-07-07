import { ART_STYLES, type ArtImage } from "./art-data"
import type { Preferences } from "./types"

export interface Recommendation {
  id: string
  title: string
  artist: string
  styleId: string
  styleName: string
  subStyleId?: string
  image: ArtImage
  score: number
}

// Catalogue derived from sub-style imagery: each sub-style stands in for a
// bookable work until real partner inventory exists.
const CATALOGUE = ART_STYLES.flatMap((style) =>
  style.subStyles.map((sub) => ({
    id: `${style.id}/${sub.id}`,
    title: sub.image.title,
    artist: sub.image.artist,
    styleId: style.id,
    styleName: style.name,
    subStyleId: sub.id,
    image: sub.image,
  })),
)

export function recommend(prefs: Preferences, limit = 6): Recommendation[] {
  const scored = CATALOGUE.map((item) => {
    let score = 0
    if (item.subStyleId && prefs.subStyles.includes(item.subStyleId)) score += 3
    if (prefs.mainStyles.includes(item.styleId)) score += 2
    const rating = prefs.ratings[item.styleId]
    if (rating === "love") score += 2
    else if (rating === "like") score += 1
    else if (rating === "dislike") score -= 3
    return { ...item, score }
  })

  return scored
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit)
}
