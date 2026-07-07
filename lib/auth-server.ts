import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySessionToken } from "./session"
import { getStore } from "./store"
import type { User } from "./types"

export async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function getSessionUser(): Promise<User | null> {
  const email = await getSessionEmail()
  if (!email) return null
  return getStore().getUserByEmail(email)
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}
