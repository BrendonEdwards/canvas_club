export type Rating = "love" | "like" | "dislike"

export interface Preferences {
  mainStyles: string[] // ids of top-level styles
  subStyles: string[] // ids of sub-styles
  ratings: Record<string, Rating> // artworkId -> rating
  originalsInterest?: boolean // early-access interest in the Originals pipeline
}

export interface Subscription {
  plan: string // Basic, Standard, Premium
  sizePreference: string // A3, A2, or Mixed
  frameKit: boolean // one-time Frame Kit purchased at signup
  monthlyPrice: number // inc VAT
}

export type UserRole = "member" | "gallery"

export interface User {
  email: string
  passwordHash: string
  name: string
  joinedDate: string
  preferences: Preferences
  subscription: Subscription | null
  role?: UserRole // defaults to "member"
  galleryId?: string // set for gallery accounts
}

export type PrintStatus = "listed" | "unlisted"

export interface GalleryPrint {
  id: string
  galleryId: string
  title: string
  artist: string
  styleId: string
  subStyleId?: string
  sizes: string[] // e.g. ["A3", "A2"]
  stockCount: number
  retailPrice: number // buy-to-keep price inc VAT, set by the gallery
  status: PrintStatus
  createdAt: string
}

export type SafeUser = Omit<User, "passwordHash">

export interface DBSchema {
  users: User[]
}

export interface PrintsSchema {
  prints: GalleryPrint[]
}

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, ...safe } = user
  return safe
}

export function emptyPreferences(): Preferences {
  return { mainStyles: [], subStyles: [], ratings: {} }
}
