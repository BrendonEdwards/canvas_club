import dictionary from "@/public/data/style-dictionary.json"
import type { StyleEntry, UserTaste } from "./types"

const styleDictionary: StyleEntry[] = dictionary as StyleEntry[]

export const getStyleDictionary = (): StyleEntry[] => styleDictionary

export const findStyleByName = (
  topStyle: string,
  subStyle?: string
): StyleEntry | undefined => {
  const normalizedTop = topStyle.toLowerCase()
  const normalizedSub = subStyle?.toLowerCase()
  return styleDictionary.find((entry) => {
    const isTopMatch = entry.top_style.toLowerCase() === normalizedTop
    if (!isTopMatch) {
      return false
    }
    if (!normalizedSub) {
      return true
    }
    return entry.sub_style.toLowerCase() === normalizedSub
  })
}

export const filterStylesByTaste = (taste: UserTaste): StyleEntry[] => {
  const {
    topStyles,
    subStyles,
    visualTags,
    colourTraits,
    motifs,
    eraMedium,
    keywords,
  } = taste

  return styleDictionary.filter((entry) => {
    const matchesTop =
      !topStyles || topStyles.length === 0
        ? true
        : topStyles.some(
            (style) => entry.top_style.toLowerCase() === style.toLowerCase()
          )

    const matchesSub =
      !subStyles || subStyles.length === 0
        ? true
        : subStyles.some(
            (style) => entry.sub_style.toLowerCase() === style.toLowerCase()
          )

    const matchesVisual =
      !visualTags || visualTags.length === 0
        ? true
        : visualTags.some((tag) =>
            entry.visual_tags.some(
              (entryTag) => entryTag.toLowerCase() === tag.toLowerCase()
            )
          )

    const matchesColour =
      !colourTraits || colourTraits.length === 0
        ? true
        : colourTraits.some((trait) =>
            entry.colour_traits.some(
              (entryTrait) => entryTrait.toLowerCase() === trait.toLowerCase()
            )
          )

    const matchesMotifs =
      !motifs || motifs.length === 0
        ? true
        : motifs.some((motif) =>
            entry.motifs.some(
              (entryMotif) => entryMotif.toLowerCase() === motif.toLowerCase()
            )
          )

    const matchesEra =
      !eraMedium || eraMedium.length === 0
        ? true
        : eraMedium.some((value) =>
            entry.era_medium.some(
              (entryValue) => entryValue.toLowerCase() === value.toLowerCase()
            )
          )

    const matchesKeywords =
      !keywords || keywords.length === 0
        ? true
        : keywords.some((keyword) => {
            const normalized = keyword.toLowerCase()
            return (
              entry.example_keywords.some(
                (entryKeyword) => entryKeyword.toLowerCase() === normalized
              ) ||
              entry.synonyms.some(
                (synonym) => synonym.toLowerCase() === normalized
              )
            )
          })

    return (
      matchesTop &&
      matchesSub &&
      matchesVisual &&
      matchesColour &&
      matchesMotifs &&
      matchesEra &&
      matchesKeywords
    )
  })
}

export const searchStyles = (query: string): StyleEntry[] => {
  if (!query) {
    return styleDictionary
  }

  const normalized = query.toLowerCase()
  return styleDictionary.filter((entry) => {
    const haystack = [
      entry.top_style,
      entry.sub_style,
      ...entry.synonyms,
      ...entry.visual_tags,
      ...entry.colour_traits,
      ...entry.motifs,
      ...entry.era_medium,
      ...entry.example_keywords,
    ]

    return haystack.some((value) => value.toLowerCase().includes(normalized))
  })
}
