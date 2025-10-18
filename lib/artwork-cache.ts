import type { Artwork } from "./types"

type ArtworkCacheStore = {
  get: (id: string) => Artwork | undefined
  set: (artwork: Artwork) => void
  getAll: () => Artwork[]
  setMany: (artworks: Artwork[]) => void
  clear: () => void
}

const STORAGE_KEY = "canvas_club.artwork_cache"

const memoryStore = new Map<string, Artwork>()

const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined"

const readFromStorage = (): Record<string, Artwork> => {
  if (!isBrowser) {
    return {}
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {}
    }
    const parsed = JSON.parse(raw) as Record<string, Artwork>
    return parsed
  } catch (error) {
    console.warn("Unable to read artwork cache from storage", error)
    return {}
  }
}

const writeToStorage = (data: Record<string, Artwork>) => {
  if (!isBrowser) {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.warn("Unable to persist artwork cache", error)
  }
}

const storageBackedStore = (): ArtworkCacheStore => {
  let cache = readFromStorage()

  const syncToMemory = () => {
    Object.values(cache).forEach((artwork) => {
      memoryStore.set(artwork.id, artwork)
    })
  }

  syncToMemory()

  return {
    get: (id: string) => {
      if (memoryStore.has(id)) {
        return memoryStore.get(id)
      }
      const stored = cache[id]
      if (stored) {
        memoryStore.set(id, stored)
      }
      return stored
    },
    set: (artwork: Artwork) => {
      memoryStore.set(artwork.id, artwork)
      cache[artwork.id] = artwork
      writeToStorage(cache)
    },
    getAll: () => {
      return Object.values(cache)
    },
    setMany: (artworks: Artwork[]) => {
      artworks.forEach((artwork) => {
        memoryStore.set(artwork.id, artwork)
        cache[artwork.id] = artwork
      })
      writeToStorage(cache)
    },
    clear: () => {
      memoryStore.clear()
      cache = {}
      if (isBrowser) {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    },
  }
}

const memoryOnlyStore = (): ArtworkCacheStore => ({
  get: (id: string) => memoryStore.get(id),
  set: (artwork: Artwork) => {
    memoryStore.set(artwork.id, artwork)
  },
  getAll: () => Array.from(memoryStore.values()),
  setMany: (artworks: Artwork[]) => {
    artworks.forEach((artwork) => memoryStore.set(artwork.id, artwork))
  },
  clear: () => memoryStore.clear(),
})

const cacheStore: ArtworkCacheStore = isBrowser
  ? storageBackedStore()
  : memoryOnlyStore()

export const normalizeArtwork = (data: any): Artwork => {
  const {
    id,
    title,
    name,
    artist,
    author,
    creator,
    date,
    imageUrl,
    image_url,
    image,
    source,
    url,
  } = data ?? {}

  const normalizedId = String(id ?? data?.objectID ?? data?.slug ?? "")
  if (!normalizedId) {
    throw new Error("Unable to normalise artwork without an identifier")
  }

  return {
    id: normalizedId,
    title: title ?? data?.objectName ?? data?.title ?? "Untitled",
    artist: artist ?? name ?? author ?? creator ?? "Unknown",
    date: date ?? data?.objectDate ?? data?.dated,
    imageUrl: imageUrl ?? image_url ?? image ?? data?.primaryImageSmall ?? data?.primaryImage ?? "",
    source: source ?? data?.source ?? url ?? data?.objectURL ?? "",
  }
}

export const cacheArtworks = (artworks: Artwork[]): void => {
  cacheStore.setMany(artworks)
}

export const cacheArtwork = (artwork: Artwork): void => {
  cacheStore.set(artwork)
}

export const getArtworkFromCache = (id: string): Artwork | undefined => {
  return cacheStore.get(id)
}

export const getAllCachedArtworks = (): Artwork[] => {
  return cacheStore.getAll()
}

export const clearArtworkCache = (): void => {
  cacheStore.clear()
}
