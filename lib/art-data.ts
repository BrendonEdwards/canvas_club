// Single source of truth for styles, sub-styles, imagery and attribution.
// Images live in public/art/ (downloaded by scripts/fetch-art.mjs).
// Historical works are public domain (artist died >70 years ago); photographic
// imagery is Unsplash-licensed. Partner-overview rule: every work carries
// artist/title/source attribution.

export interface ArtImage {
  src: string
  artist: string
  title: string
  source: "Wikimedia Commons" | "Unsplash" | "Canvas Club Studio"
  license: "Public domain" | "Unsplash Licence" | "CC0 (derived from public-domain works)"
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

const studio = (id: string, title: string): ArtImage => ({
  src: `/art/${id}.jpg`,
  artist: "Canvas Club Studio",
  title,
  source: "Canvas Club Studio",
  license: "CC0 (derived from public-domain works)",
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
      { id: "mountain", name: "Mountainscapes", image: pd("mountain", "Katsushika Hokusai", "Fine Wind, Clear Morning (c.1831)") },
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
    image: pd("minimalist", "James McNeill Whistler", "Nocturne in Blue and Silver, Chelsea (1871)"),
    taxonomy: {
      visualTags: ["negative space", "clean lines", "reduction"],
      colourTraits: ["neutral palette", "tonal", "low contrast"],
      motifs: ["stillness", "simple forms", "calm interiors"],
      eraMedium: ["19th–21st century", "mixed media", "photography"],
    },
    subStyles: [
      { id: "line-art", name: "Line Art", image: pd("line-art", "Aubrey Beardsley", "The Peacock Skirt (1893)") },
      { id: "monochrome", name: "Monochrome", image: pd("monochrome", "Alfred Stieglitz", "The Steerage (1907)") },
      { id: "scandinavian", name: "Scandinavian", image: pd("scandinavian", "Vilhelm Hammershøi", "Interior with Woman from Behind (1903)") },
      { id: "geometric-minimal", name: "Geometric Minimal", image: pd("geometric-minimal", "Kazimir Malevich", "Suprematist Composition (1916)") },
    ],
  },
  {
    id: "surrealism",
    name: "Surrealism",
    description: "Dream logic: familiar things in impossible arrangements.",
    image: pd("surrealism", "Henri Rousseau", "The Dream (1910)"),
    taxonomy: {
      visualTags: ["dreamlike", "juxtaposition", "uncanny"],
      colourTraits: ["lush", "theatrical light", "deep shadows"],
      motifs: ["dreams", "jungles", "the subconscious"],
      eraMedium: ["early 20th century", "oil on canvas", "photography"],
    },
    subStyles: [
      { id: "dreamscapes", name: "Dreamscapes", image: pd("dreamscapes", "Henri Rousseau", "The Sleeping Gypsy (1897)") },
      { id: "symbolism", name: "Symbolism", image: pd("symbolism", "Odilon Redon", "The Cyclops (c.1914)") },
      { id: "surreal-photography", name: "Surreal Photography", image: studio("surreal-photography", "Double exposure study (after Vermeer and Van Gogh)") },
    ],
  },
  {
    id: "pop-art",
    name: "Pop Art",
    description: "Bold, graphic and playful: art borrowed from popular culture.",
    image: pd("pop-art", "Leonetto Cappiello", "Maurin Quina (1906)"),
    taxonomy: {
      visualTags: ["bold outlines", "graphic", "playful"],
      colourTraits: ["primary colours", "high saturation", "flat colour"],
      motifs: ["popular culture", "advertising", "icons"],
      eraMedium: ["20th–21st century", "screen print", "digital"],
    },
    subStyles: [
      { id: "comic-strip", name: "Comic Strip Style", image: pd("comic-strip", "Winsor McCay", "Little Nemo in Slumberland (1906)") },
      { id: "advertising", name: "Advertising Aesthetic", image: pd("advertising", "Henri de Toulouse-Lautrec", "Moulin Rouge: La Goulue (1891)") },
      { id: "collage-pop", name: "Collage", image: pd("collage-pop", "Kurt Schwitters", "Merz-Painting 9b (1919)") },
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
      { id: "botanical-watercolour", name: "Botanical", image: pd("botanical-watercolour", "Pierre-Joseph Redouté", "Rosa centifolia Burgundiaca") },
      { id: "urban-sketch", name: "Urban Sketching", image: pd("urban-sketch", "James McNeill Whistler", "The Doorway (1880)") },
    ],
  },
  {
    id: "black-white",
    name: "Black & White",
    description: "Monochrome photography: light, shadow and story.",
    image: pd("black-white", "Alfred Stieglitz", "Winter, Fifth Avenue (1893)"),
    taxonomy: {
      visualTags: ["monochrome", "high contrast", "strong composition"],
      colourTraits: ["black and white", "grey tonal range"],
      motifs: ["street life", "architecture", "human stories"],
      eraMedium: ["20th–21st century", "film", "digital photography"],
    },
    subStyles: [
      { id: "documentary", name: "Documentary", image: pd("documentary", "Jacob Riis", "Bandits' Roost (1888)") },
      { id: "architectural-bw", name: "Architectural", image: pd("architectural-bw", "Alfred Stieglitz", "The Flatiron (1903)") },
      { id: "fine-art-bw", name: "Fine Art", image: pd("fine-art-bw", "Léonard Misonne", "The Mill") },
    ],
  },
  {
    id: "urban",
    name: "Urban",
    description: "The energy of the city: streets, skylines and neon.",
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
    description: "Born on screen: renders, glitches and layered digital worlds.",
    image: studio("digital-art", "Pixel-sorted Great Wave (after Hokusai)"),
    taxonomy: {
      visualTags: ["synthetic", "layered textures", "screen-native"],
      colourTraits: ["vibrant", "duotone", "neon gradients"],
      motifs: ["technology", "future worlds", "glitch aesthetics"],
      eraMedium: ["21st century", "digital"],
    },
    subStyles: [
      { id: "glitch", name: "Glitch", image: studio("glitch", "Glitch study (after Leonardo)") },
      { id: "render-3d", name: "3D Render", image: studio("render-3d", "Gradient forms study") },
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
