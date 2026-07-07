// Single source of truth for styles, sub-styles, imagery and attribution.
// Images live in public/art/ (downloaded by scripts/fetch-art.mjs).
// Historical works are public domain (artist died >70 years ago); photographic
// imagery is Unsplash-licensed. Partner-overview rule: every work carries
// artist/title/source attribution.

export interface ArtImage {
  src: string
  artist: string
  title: string
  source: "Wikimedia Commons" | "Unsplash"
  license: "Public domain" | "Unsplash Licence"
}

export interface SubStyle {
  id: string
  name: string
  image: ArtImage
}

export interface StyleTaxonomy {
  visualTags: string[]
  colourTraits: string[]
  motifs: string[]
  eraMedium: string[]
}

export interface ArtStyle {
  id: string
  name: string
  description: string
  image: ArtImage
  taxonomy: StyleTaxonomy
  subStyles: SubStyle[]
}

const pd = (id: string, artist: string, title: string): ArtImage => ({
  src: `/art/${id}.jpg`,
  artist,
  title,
  source: "Wikimedia Commons",
  license: "Public domain",
})

const photo = (id: string, title: string): ArtImage => ({
  src: `/art/${id}.jpg`,
  artist: "Unsplash contributor",
  title,
  source: "Unsplash",
  license: "Unsplash Licence",
})

export const ART_STYLES: ArtStyle[] = [
  {
    id: "abstract",
    name: "Abstract",
    description: "Colour, form and gesture free from literal representation.",
    image: pd("abstract", "Wassily Kandinsky", "Composition VII (1913)"),
    taxonomy: {
      visualTags: ["non-representational", "bold gesture", "layered composition"],
      colourTraits: ["saturated", "high contrast", "chromatic play"],
      motifs: ["colour blocks", "dynamic movement", "inner states"],
      eraMedium: ["20th century", "oil on canvas", "acrylic"],
    },
    subStyles: [
      { id: "geometric", name: "Geometric", image: pd("geometric", "Piet Mondrian", "Composition II in Red, Blue, and Yellow (1930)") },
      { id: "expressive-abstract", name: "Expressive Abstraction", image: pd("expressive-abstract", "Wassily Kandinsky", "Composition 8 (1923)") },
      { id: "colour-field", name: "Colour Field", image: pd("colour-field", "Hilma af Klint", "The Swan, No. 17 (1915)") },
      { id: "fluid", name: "Fluid Art", image: photo("fluid", "Marbled paint pour") },
    ],
  },
  {
    id: "impressionist",
    name: "Impressionist",
    description: "Light-drenched scenes caught in loose, visible brushwork.",
    image: pd("impressionist", "Claude Monet", "Impression, Sunrise (1872)"),
    taxonomy: {
      visualTags: ["soft brushwork", "diffused light", "atmospheric"],
      colourTraits: ["pastel", "sunlit", "high chroma"],
      motifs: ["landscapes", "water scenes", "urban leisure"],
      eraMedium: ["19th century", "oil on canvas", "plein air"],
    },
    subStyles: [
      { id: "post-impressionism", name: "Post-Impressionism", image: pd("post-impressionism", "Vincent van Gogh", "The Starry Night (1889)") },
      { id: "pointillism", name: "Pointillism", image: pd("pointillism", "Georges Seurat", "A Sunday on La Grande Jatte (1884)") },
      { id: "plein-air", name: "Plein Air", image: pd("plein-air", "Claude Monet", "Woman with a Parasol (1875)") },
      { id: "modern-impressionism", name: "Modern Impressionism", image: photo("modern-impressionism", "Contemporary impressionistic scene") },
    ],
  },
  {
    id: "landscape",
    name: "Landscape",
    description: "The natural and built world, from pastoral calm to dramatic vistas.",
    image: pd("landscape", "John Constable", "The Hay Wain (1821)"),
    taxonomy: {
      visualTags: ["horizon lines", "depth of field", "natural light"],
      colourTraits: ["earth tones", "verdant greens", "sky blues"],
      motifs: ["countryside", "coasts", "mountains"],
      eraMedium: ["19th century", "oil on canvas", "photography"],
    },
    subStyles: [
      { id: "pastoral", name: "Pastoral", image: pd("pastoral", "Themistokles von Eckenbrecher", "View of Lærdalsøren (1901)") },
      { id: "seascape", name: "Seascape", image: pd("seascape", "Katsushika Hokusai", "The Great Wave off Kanagawa (c.1831)") },
      { id: "mountain", name: "Mountainscapes", image: photo("mountain", "Alpine mountain range") },
      { id: "forest", name: "Forest Scenes", image: photo("forest", "Sunlit forest path") },
      { id: "urban-landscape", name: "Urban Landscape", image: pd("urban-landscape", "Gustave Caillebotte", "Paris Street; Rainy Day (1877)") },
    ],
  },
  {
    id: "portrait",
    name: "Portrait",
    description: "The human face and figure, from classical poise to modern candour.",
    image: pd("portrait", "Johannes Vermeer", "Girl with a Pearl Earring (c.1665)"),
    taxonomy: {
      visualTags: ["figurative", "expressive gaze", "considered lighting"],
      colourTraits: ["skin tones", "chiaroscuro", "muted grounds"],
      motifs: ["identity", "character studies", "the gaze"],
      eraMedium: ["17th–20th century", "oil on canvas", "photography"],
    },
    subStyles: [
      { id: "classical-portrait", name: "Classical", image: pd("classical-portrait", "Leonardo da Vinci", "Mona Lisa (c.1503)") },
      { id: "expressive-portrait", name: "Expressive", image: pd("expressive-portrait", "Vincent van Gogh", "Self-Portrait (1889)") },
      { id: "contemporary-portrait", name: "Contemporary", image: photo("contemporary-portrait", "Contemporary portrait in neon light") },
      { id: "figurative", name: "Figurative Scenes", image: pd("figurative", "Edgar Degas", "The Ballet Class (c.1874)") },
    ],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Restraint, negative space and quiet tonal harmony.",
    image: pd("minimalist", "James McNeill Whistler", "Nocturne: Blue and Silver — Chelsea (1871)"),
    taxonomy: {
      visualTags: ["negative space", "clean lines", "reduction"],
      colourTraits: ["neutral palette", "tonal", "low contrast"],
      motifs: ["stillness", "simple forms", "calm interiors"],
      eraMedium: ["19th–21st century", "mixed media", "photography"],
    },
    subStyles: [
      { id: "line-art", name: "Line Art", image: photo("line-art", "Minimal single-line drawing") },
      { id: "monochrome", name: "Monochrome", image: photo("monochrome", "Calm monochrome seascape") },
      { id: "scandinavian", name: "Scandinavian", image: photo("scandinavian", "Scandinavian interior still life") },
      { id: "geometric-minimal", name: "Geometric Minimal", image: photo("geometric-minimal", "Minimal geometric architecture") },
    ],
  },
  {
    id: "surrealism",
    name: "Surrealism",
    description: "Dream logic — familiar things in impossible arrangements.",
    image: pd("surrealism", "Henri Rousseau", "The Dream (1910)"),
    taxonomy: {
      visualTags: ["dreamlike", "juxtaposition", "uncanny"],
      colourTraits: ["lush", "theatrical light", "deep shadows"],
      motifs: ["dreams", "jungles", "the subconscious"],
      eraMedium: ["early 20th century", "oil on canvas", "photography"],
    },
    subStyles: [
      { id: "dreamscapes", name: "Dreamscapes", image: pd("dreamscapes", "Henri Rousseau", "Jungle scene") },
      { id: "symbolism", name: "Symbolism", image: pd("symbolism", "Odilon Redon", "The Cyclops (c.1914)") },
      { id: "surreal-photography", name: "Surreal Photography", image: photo("surreal-photography", "Surreal staged photograph") },
    ],
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Bold, graphic and playful — art borrowed from popular culture.",
    image: photo("pop-art", "Pop-style colour portrait"),
    taxonomy: {
      visualTags: ["bold outlines", "graphic", "playful"],
      colourTraits: ["primary colours", "high saturation", "flat colour"],
      motifs: ["popular culture", "advertising", "icons"],
      eraMedium: ["20th–21st century", "screen print", "digital"],
    },
    subStyles: [
      { id: "comic-strip", name: "Comic Strip Style", image: photo("comic-strip", "Comic-style graphic wall") },
      { id: "advertising", name: "Advertising Aesthetic", image: photo("advertising", "Retro advertising signage") },
      { id: "collage-pop", name: "Collage", image: photo("collage-pop", "Layered paper collage") },
    ],
  },
  {
    id: "cubism",
    name: "Cubism",
    description: "Subjects fractured into planes and reassembled from every angle.",
    image: pd("cubism", "Juan Gris", "Portrait of Pablo Picasso (1912)"),
    taxonomy: {
      visualTags: ["fragmented planes", "multiple viewpoints", "faceted"],
      colourTraits: ["muted earth tones", "grey-browns", "structured contrast"],
      motifs: ["still life", "portraits", "instruments"],
      eraMedium: ["early 20th century", "oil on canvas"],
    },
    subStyles: [
      { id: "analytical-cubism", name: "Analytical Cubism", image: pd("analytical-cubism", "Robert Delaunay", "La ville no. 2 (1910)") },
      { id: "synthetic-cubism", name: "Synthetic Cubism", image: pd("synthetic-cubism", "Juan Gris", "Still Life with Checked Tablecloth (1915)") },
    ],
  },
  {
    id: "watercolour",
    name: "Watercolour",
    description: "Translucent washes and delicate, luminous colour.",
    image: pd("watercolour", "Winslow Homer", "The Blue Boat (1892)"),
    taxonomy: {
      visualTags: ["translucent washes", "soft edges", "luminous"],
      colourTraits: ["delicate", "watery blues", "paper white"],
      motifs: ["boats", "botanicals", "travel sketches"],
      eraMedium: ["19th–21st century", "watercolour on paper"],
    },
    subStyles: [
      { id: "loose-wash", name: "Loose Wash", image: pd("loose-wash", "John Singer Sargent", "Venice (c.1902)") },
      { id: "botanical-watercolour", name: "Botanical", image: photo("botanical-watercolour", "Botanical flower study") },
      { id: "urban-sketch", name: "Urban Sketching", image: photo("urban-sketch", "City sketching scene") },
    ],
  },
  {
    id: "black-white",
    name: "Black & White",
    description: "Monochrome photography — light, shadow and story.",
    image: photo("black-white", "High-contrast monochrome scene"),
    taxonomy: {
      visualTags: ["monochrome", "high contrast", "strong composition"],
      colourTraits: ["black and white", "grey tonal range"],
      motifs: ["street life", "architecture", "human stories"],
      eraMedium: ["20th–21st century", "film", "digital photography"],
    },
    subStyles: [
      { id: "documentary", name: "Documentary", image: photo("documentary", "Candid street documentary") },
      { id: "architectural-bw", name: "Architectural", image: photo("architectural-bw", "Brutalist architecture study") },
      { id: "fine-art-bw", name: "Fine Art", image: photo("fine-art-bw", "Fine-art monochrome landscape") },
    ],
  },
  {
    id: "urban",
    name: "Urban",
    description: "The energy of the city — streets, skylines and neon.",
    image: photo("urban", "City skyline at dusk"),
    taxonomy: {
      visualTags: ["cityscape", "geometry of streets", "human bustle"],
      colourTraits: ["neon accents", "concrete greys", "night blues"],
      motifs: ["skylines", "street corners", "city nights"],
      eraMedium: ["19th–21st century", "oil on canvas", "photography"],
    },
    subStyles: [
      { id: "cityscape", name: "Cityscape", image: pd("cityscape", "Camille Pissarro", "Boulevard Montmartre (1897)") },
      { id: "night-city", name: "Night City", image: photo("night-city", "Neon-lit night street") },
    ],
  },
  {
    id: "nature",
    name: "Nature",
    description: "Flora, fauna and wild places in intimate detail.",
    image: photo("nature", "Sunlight through forest canopy"),
    taxonomy: {
      visualTags: ["organic forms", "natural detail", "seasonal light"],
      colourTraits: ["verdant", "earthy", "botanical greens"],
      motifs: ["plants", "wildlife", "coastlines"],
      eraMedium: ["19th–21st century", "photography", "illustration"],
    },
    subStyles: [
      { id: "botanical", name: "Botanical", image: photo("botanical", "Botanical close-up") },
      { id: "wildlife", name: "Wildlife", image: photo("wildlife", "Wildlife portrait") },
      { id: "coastal-nature", name: "Coastal", image: photo("coastal-nature", "Quiet coastal shoreline") },
    ],
  },
  {
    id: "digital-art",
    name: "Digital Art",
    description: "Born on screen — renders, glitches and layered digital worlds.",
    image: photo("digital-art", "Abstract digital artwork"),
    taxonomy: {
      visualTags: ["synthetic", "layered textures", "screen-native"],
      colourTraits: ["vibrant", "duotone", "neon gradients"],
      motifs: ["technology", "future worlds", "glitch aesthetics"],
      eraMedium: ["21st century", "digital"],
    },
    subStyles: [
      { id: "glitch", name: "Glitch", image: photo("glitch", "Glitch light abstraction") },
      { id: "render-3d", name: "3D Render", image: photo("render-3d", "Stylised 3D render") },
      { id: "digital-collage", name: "Digital Collage", image: photo("digital-collage", "Layered digital collage") },
    ],
  },
]

// Deck used by the wizard's rating step: one representative work per style,
// keyed by style id so ratings map directly onto taste data.
export const RATING_DECK: { id: string; styleId: string; styleName: string; image: ArtImage }[] =
  ART_STYLES.map((style) => ({
    id: style.id,
    styleId: style.id,
    styleName: style.name,
    image: style.image,
  }))

// Customer-facing credit line: named artists get full attribution; licensed
// stock photography is credited by source rather than a placeholder name.
export function displayCredit(image: ArtImage): string {
  return image.source === "Unsplash" ? image.title : `${image.artist} · ${image.title}`
}

export function findStyle(id: string): ArtStyle | null {
  return ART_STYLES.find((s) => s.id === id) ?? null
}

export function findSubStyle(id: string): { style: ArtStyle; sub: SubStyle } | null {
  for (const style of ART_STYLES) {
    const sub = style.subStyles.find((s) => s.id === id)
    if (sub) return { style, sub }
  }
  return null
}
