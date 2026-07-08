import fs from "fs"
import path from "path"
import crypto from "crypto"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { GalleryPrint, PrintsSchema } from "./types"

// Inventory data-access boundary for partner galleries.
export interface PrintStore {
  listByGallery(galleryId: string): Promise<GalleryPrint[]>
  create(print: Omit<GalleryPrint, "id" | "createdAt">): Promise<GalleryPrint>
  update(id: string, galleryId: string, updates: Partial<GalleryPrint>): Promise<GalleryPrint | null>
}

export class FilePrintStore implements PrintStore {
  private readonly dbPath: string

  constructor(dataDir?: string) {
    const dir = dataDir ?? process.env.DATA_DIR ?? path.join(process.cwd(), "data")
    this.dbPath = path.join(dir, "prints.json")
  }

  private read(): PrintsSchema {
    try {
      const dir = path.dirname(this.dbPath)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      if (!fs.existsSync(this.dbPath)) return { prints: [] }
      const raw = fs.readFileSync(this.dbPath, "utf-8")
      return raw.trim() ? (JSON.parse(raw) as PrintsSchema) : { prints: [] }
    } catch (error) {
      console.warn("FilePrintStore: unable to read, starting empty", error)
      return { prints: [] }
    }
  }

  private write(db: PrintsSchema): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2))
  }

  async listByGallery(galleryId: string): Promise<GalleryPrint[]> {
    return this.read().prints.filter((p) => p.galleryId === galleryId)
  }

  async create(print: Omit<GalleryPrint, "id" | "createdAt">): Promise<GalleryPrint> {
    const db = this.read()
    const full: GalleryPrint = { ...print, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    db.prints.push(full)
    this.write(db)
    return full
  }

  async update(id: string, galleryId: string, updates: Partial<GalleryPrint>): Promise<GalleryPrint | null> {
    const db = this.read()
    const index = db.prints.findIndex((p) => p.id === id && p.galleryId === galleryId)
    if (index === -1) return null
    db.prints[index] = { ...db.prints[index], ...updates, id, galleryId }
    this.write(db)
    return db.prints[index]
  }
}

interface PrintRow {
  id: string
  gallery_id: string
  title: string
  artist: string
  style_id: string
  sub_style_id: string | null
  sizes: string[]
  stock_count: number
  retail_price: number
  status: string
  created_at: string
}

const toPrint = (r: PrintRow): GalleryPrint => ({
  id: r.id,
  galleryId: r.gallery_id,
  title: r.title,
  artist: r.artist,
  styleId: r.style_id,
  subStyleId: r.sub_style_id ?? undefined,
  sizes: r.sizes,
  stockCount: r.stock_count,
  retailPrice: r.retail_price,
  status: r.status as GalleryPrint["status"],
  createdAt: r.created_at,
})

export class SupabasePrintStore implements PrintStore {
  private readonly client: SupabaseClient

  constructor(url: string, secretKey: string) {
    this.client = createClient(url, secretKey, { auth: { persistSession: false } })
  }

  async listByGallery(galleryId: string): Promise<GalleryPrint[]> {
    const { data, error } = await this.client
      .from("prints")
      .select("*")
      .eq("gallery_id", galleryId)
      .order("created_at", { ascending: false })
    if (error) throw new Error(`Supabase read failed: ${error.message}`)
    return (data as PrintRow[]).map(toPrint)
  }

  async create(print: Omit<GalleryPrint, "id" | "createdAt">): Promise<GalleryPrint> {
    const { data, error } = await this.client
      .from("prints")
      .insert({
        gallery_id: print.galleryId,
        title: print.title,
        artist: print.artist,
        style_id: print.styleId,
        sub_style_id: print.subStyleId ?? null,
        sizes: print.sizes,
        stock_count: print.stockCount,
        retail_price: print.retailPrice,
        status: print.status,
      })
      .select()
      .single()
    if (error) throw new Error(`Supabase insert failed: ${error.message}`)
    return toPrint(data as PrintRow)
  }

  async update(id: string, galleryId: string, updates: Partial<GalleryPrint>): Promise<GalleryPrint | null> {
    const row: Record<string, unknown> = {}
    if (updates.title !== undefined) row.title = updates.title
    if (updates.artist !== undefined) row.artist = updates.artist
    if (updates.styleId !== undefined) row.style_id = updates.styleId
    if (updates.subStyleId !== undefined) row.sub_style_id = updates.subStyleId ?? null
    if (updates.sizes !== undefined) row.sizes = updates.sizes
    if (updates.stockCount !== undefined) row.stock_count = updates.stockCount
    if (updates.retailPrice !== undefined) row.retail_price = updates.retailPrice
    if (updates.status !== undefined) row.status = updates.status

    const { data, error } = await this.client
      .from("prints")
      .update(row)
      .eq("id", id)
      .eq("gallery_id", galleryId)
      .select()
      .maybeSingle()
    if (error) throw new Error(`Supabase update failed: ${error.message}`)
    return data ? toPrint(data as PrintRow) : null
  }
}

let printStore: PrintStore | null = null

export function getPrintStore(): PrintStore {
  if (!printStore) {
    const url = process.env.SUPABASE_URL
    const secretKey = process.env.SUPABASE_SECRET_KEY
    printStore = url && secretKey ? new SupabasePrintStore(url, secretKey) : new FilePrintStore()
  }
  return printStore
}
