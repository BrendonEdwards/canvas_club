"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

export default function AccountPage() {
  const router = useRouter()
  const { user, login, logout } = useAuth()
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setEmail(user)
    }
  }, [user, router])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      login(email)
      alert("Account details updated")
    }
  }

  if (!user) return null

  return (
    <main className="mx-auto max-w-md space-y-6 p-6">
      <h1 className="text-3xl font-serif">Your Account</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit">Save</Button>
      </form>
      <div className="space-x-4">
        <Link href="/account/preferences" className="underline">
          Refine your taste
        </Link>
        <Link href="/order" className="underline">
          Order prints
        </Link>
      </div>
      <Button variant="outline" onClick={logout} className="mt-4">
        Log out
      </Button>
    </main>
  )
}
