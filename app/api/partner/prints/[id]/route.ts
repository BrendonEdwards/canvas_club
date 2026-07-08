import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { getPrintStore } from "@/lib/prints-store"
import type { GalleryPrint } from "@/lib/types"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user || user.role !== "gallery" || !user.galleryId) {
    return NextResponse.json({ error: "Gallery account required" }, { status: 403 })
  }
  try {
    const { id } = await params
    const body = await req.json()
    const updates: Partial<GalleryPrint> = {}

    if (body.stockCount !== undefined) {
      const stock = Number.parseInt(body.stockCount, 10)
      if (Number.isNaN(stock) || stock < 0) {
        return NextResponse.json({ error: "Stock must be zero or more" }, { status: 400 })
      }
      updates.stockCount = stock
    }
    if (body.retailPrice !== undefined) {
      const price = Number.parseFloat(body.retailPrice)
      if (Number.isNaN(price) || price < 0) {
        return NextResponse.json({ error: "Price must be zero or more" }, { status: 400 })
      }
      updates.retailPrice = price
    }
    if (body.status === "listed" || body.status === "unlisted") {
      updates.status = body.status
    }

    const updated = await getPrintStore().update(id, user.galleryId, updates)
    if (!updated) {
      return NextResponse.json({ error: "Print not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
