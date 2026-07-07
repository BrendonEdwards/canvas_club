import type { User } from "./types"
import { FileUserStore } from "./store-file"
import { SupabaseUserStore } from "./store-supabase"

// Data-access boundary: API routes only ever see this interface.
export interface UserStore {
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<User> // throws Error("USER_EXISTS") on duplicate email
  updateUser(email: string, updates: Partial<User>): Promise<User | null>
}

let store: UserStore | null = null

// Supabase when configured (SUPABASE_URL + SUPABASE_SECRET_KEY in env),
// otherwise the local file store — so dev and tests never need the network.
export function getStore(): UserStore {
  if (!store) {
    const url = process.env.SUPABASE_URL
    const secretKey = process.env.SUPABASE_SECRET_KEY
    store = url && secretKey ? new SupabaseUserStore(url, secretKey) : new FileUserStore()
  }
  return store
}
