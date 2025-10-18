import { NextResponse } from "next/server"

export type Recommendation = {
  id: string
  title: string
  artist: string
  image: string
  style?: string
}

const CATALOG: Recommendation[] = [
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
  {
    id: "serene-coast",
    title: "Serene Coast",
    artist: "Harper Ellis",
    style: "Landscape",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "portrait-artist",
    title: "Portrait Artist",
    artist: "Ravi Sethi",
    style: "Portrait",
    image: "https://media.meer.com/attachments/823e3abf8cd5ca97690888cf8e21b3ee0e7ef2a1/store/fill/860/645/67568b9166ef3f4eef54cc259f1951f7a178342cdfaa41fbfad508cff067/Girl-with-a-Pearl-Earring-is-an-oil-painting-by-Dutch-Golden-Age-painter-Johannes-Vermeer-dated.jpg",
  },
  {
    id: "coastal-dream",
    title: "Coastal Dream",
    artist: "Harper Ellis",
    style: "Landscape",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg/1200px-Themistokles_von_Eckenbrecher_Utsikt_over_L%C3%A6rdals%C3%B8ren.jpeg",
  },
  {
    id: "surreal-batman",
    title: "Surreal Ironing",
    artist: "Maya Noor",
    style: "Surrealism",
    image: "https://jimmoir.com/wp-content/uploads/2024/12/Batman-Ironing.jpg",
  },
  {
    id: "midnight-garden",
    title: "Midnight Garden",
    artist: "Isla Rowan",
    style: "Botanical",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "golden-hour",
    title: "Golden Hour",
    artist: "Theo Banks",
    style: "Impressionism",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80",
  },
]

function parseTasteSeed(seed: string | null) {
  if (!seed || seed === "neutral") {
    return { likes: new Set<string>(), dislikes: new Set<string>() }
  }

  try {
    const payload = JSON.parse(seed) as { like?: string[]; dislike?: string[] }
    return {
      likes: new Set(payload.like ?? []),
      dislikes: new Set(payload.dislike ?? []),
    }
  } catch (error) {
    return { likes: new Set<string>(), dislikes: new Set<string>() }
  }
}

function buildRotation(likes: Set<string>, dislikes: Set<string>) {
  const filtered = CATALOG.filter((item) => !dislikes.has(item.id))
  const preferred = filtered.filter((item) => likes.has(item.id))
  const rest = filtered.filter((item) => !likes.has(item.id))
  const rotation = [...preferred, ...rest]
  return rotation.slice(0, 6)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { likes, dislikes } = parseTasteSeed(searchParams.get("tasteSeed"))
  const recommendations = buildRotation(likes, dislikes)

  return NextResponse.json({
    recommendations,
    meta: {
      total: recommendations.length,
      generatedAt: new Date().toISOString(),
    },
  })
}
