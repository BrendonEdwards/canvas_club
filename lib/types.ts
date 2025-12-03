export interface SubStyle {
  id: string
  name: string
  image?: string
}

export interface ArtStyle {
  id: string
  name: string
  image: string
  subStyles: SubStyle[]
}

export interface UserPreferences {
  mainStyles: string[] // IDs of main styles
  subStyles: string[] // IDs of sub styles
  ratings: Record<string, number> // artworkId -> rating
  excludedStyles?: string[]
}

export interface Subscription {
  plan: string // Basic, Standard, Premium, Custom
  piecesPerQuarter: number
  price: number
  billingCycle: "monthly" | "yearly"
  artistTier: string
  artType: string
  size: string
  frameCommitment: boolean
  nextDeliveryDate: string
}

export interface Artwork {
  id: string
  title: string
  artist: string
  imageUrl: string
  returnDate: string
  status: "active" | "returned" | "purchased"
}

export interface User {
  email: string
  name?: string
  password?: string // In a real app, this would be hashed
  preferences: UserPreferences
  subscription?: Subscription
  currentRotation: Artwork[]
  joinedDate: string
}

export interface DBSchema {
  users: User[]
}
