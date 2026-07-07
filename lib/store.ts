import type { User } from "./types"
import { FileUserStore } from "./store-file"

// Data-access boundary: swap this implementation (e.g. for Supabase/Postgres)
// without touching API routes.
export interface UserStore {
  getUserByEmail(email: string): Promise<User | null>
  createUser(user: User): Promise<User> // throws Error("USER_EXISTS") on duplicate email
  updateUser(email: string, updates: Partial<User>): Promise<User | null>
}

let store: UserStore | null = null

export function getStore(): UserStore {
  if (!store) {
    store = new FileUserStore()
  }
  return store
}
