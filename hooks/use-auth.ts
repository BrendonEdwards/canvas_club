"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("userEmail")
    if (stored) setUser(stored)
  }, [])

  const login = (email: string) => {
    localStorage.setItem("userEmail", email)
    setUser(email)
  }

  const logout = () => {
    localStorage.removeItem("userEmail")
    setUser(null)
  }

  return { user, login, logout }
}
