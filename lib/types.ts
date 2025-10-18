export type StyleEntry = {
  top_style: string
  sub_style: string
  synonyms: string[]
  visual_tags: string[]
  colour_traits: string[]
  motifs: string[]
  era_medium: string[]
  example_keywords: string[]
}

export type UserTaste = {
  topStyles?: string[]
  subStyles?: string[]
  visualTags?: string[]
  colourTraits?: string[]
  motifs?: string[]
  eraMedium?: string[]
  keywords?: string[]
}

export type Artwork = {
  id: string
  title: string
  artist: string
  date?: string
  imageUrl: string
  source: string
}

export type FeedbackEvent = {
  id: string
  artworkId: string
  userId?: string
  rating?: number
  favourite?: boolean
  comments?: string
  createdAt: string
}
