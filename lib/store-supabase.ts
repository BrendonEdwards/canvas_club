import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Preferences, Subscription, User } from "./types"

interface UserRow {
  email: string
  password_hash: string
  name: string
  joined_date: string
  preferences: Preferences
  subscription: Subscription | null
}

function toUser(row: UserRow): User {
  return {
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    joinedDate: row.joined_date,
    preferences: row.preferences,
    subscription: row.subscription,
  }
}

function toRow(user: User): UserRow {
  return {
    email: user.email,
    password_hash: user.passwordHash,
    name: user.name,
    joined_date: user.joinedDate,
    preferences: user.preferences,
    subscription: user.subscription,
  }
}

// Server-only Postgres store. Uses the project's secret key (bypasses RLS);
// the users table itself is RLS deny-all, so the public anon key grants nothing.
export class SupabaseUserStore {
  private readonly client: SupabaseClient

  constructor(url: string, secretKey: string) {
    this.client = createClient(url, secretKey, {
      auth: { persistSession: false },
    })
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client.from("users").select("*").eq("email", email).maybeSingle()
    if (error) throw new Error(`Supabase read failed: ${error.message}`)
    return data ? toUser(data as UserRow) : null
  }

  async createUser(user: User): Promise<User> {
    const { error } = await this.client.from("users").insert(toRow(user))
    if (error) {
      if (error.code === "23505") {
        throw new Error("USER_EXISTS")
      }
      throw new Error(`Supabase insert failed: ${error.message}`)
    }
    return user
  }

  async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    const row: Partial<UserRow> = {}
    if (updates.passwordHash !== undefined) row.password_hash = updates.passwordHash
    if (updates.name !== undefined) row.name = updates.name
    if (updates.joinedDate !== undefined) row.joined_date = updates.joinedDate
    if (updates.preferences !== undefined) row.preferences = updates.preferences
    if (updates.subscription !== undefined) row.subscription = updates.subscription

    const { data, error } = await this.client
      .from("users")
      .update(row)
      .eq("email", email)
      .select()
      .maybeSingle()
    if (error) throw new Error(`Supabase update failed: ${error.message}`)
    return data ? toUser(data as UserRow) : null
  }
}
