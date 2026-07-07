"use client"

import { useCallback, useEffect, useState } from "react"
import type { SafeUser } from "@/lib/types"

export type LoginResult = { ok: true } | { ok: false; error: string }

export function useAuth() {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me")
      setUser(res.ok ? await res.json() : null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        setUser(await res.json())
        return { ok: true }
      }
      const data = await res.json().catch(() => ({}))
      return { ok: false, error: data.error ?? "Invalid email or password" }
    } catch {
      return { ok: false, error: "Something went wrong. Please try again." }
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  return { user, loading, login, logout, refresh }
}
