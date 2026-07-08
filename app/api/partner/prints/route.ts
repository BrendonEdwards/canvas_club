import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { getPrintStore } from "@/lib/prints-store"
import { findStyle } from "@/lib/art-data"
import type { User } from "@/lib/types"

function galleryOf(user: User | null): string | null {
  return user && user.role === "gallery" && user.galleryId ? user.galleryId : null
}

export async function GET() {
  const galleryId = galleryOf(await getSessionUser())
  if (!galleryId) {
    return NextResponse.json({ error: "Gallery account required" }, { status: 403 })
  }
  return NextResponse.json({ prints: await getPrintStore().listByGallery(galleryId) })
}

export async function POST(req: Request) {
  const galleryId = galleryOf(await getSessionUser())
  if (!galleryId) {
    return NextResponse.json({ error: "Gallery account required" }, { status: 403 })
  }
  try {
    const body = await req.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const artist = typeof body.artist === "string" ? body.artist.trim() : ""
    const styleId = typeof body.styleId === "string" ? body.styleId : ""
    if (!title || !artist) {
      return NextResponse.json({ error: "Title and artist are required" }, { status: 400 })
    }
    if (!findStyle(styleId)) {
      return NextResponse.json({ error: "Please choose a valid style" }, { status: 400 })
    }
    const sizes = Array.isArray(body.sizes) ? body.sizes.filter((s: unknown) => s === "A3" || s === "A2") : []
    if (sizes.length === 0) {
      return NextResponse.json({ error: "Select at least one size" }, { status: 400 })
    }
    const stockCount = Number.parseInt(body.stockCount, 10)
    const retailPrice = Number.parseFloat(body.retailPrice)
    if (Number.isNaN(stockCount) || stockCount < 0) {
      return NextResponse.json({ error: "Stock must be zero or more" }, { status: 400 })
    }
    if (Number.isNaN(retailPrice) || retailPrice < 0) {
      return NextResponse.json({ error: "Price must be zero or more" }, { status: 400 })
    }

    const print = await getPrintStore().create({
      galleryId,
      title,
      artist,
      styleId,
      subStyleId: typeof body.subStyleId === "string" && body.subStyleId ? body.subStyleId : undefined,
      sizes,
      stockCount,
      retailPrice,
      status: "listed",
    })
    return NextResponse.json(print)
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
