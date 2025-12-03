"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        const user = await res.json()
        login(user.email)
        router.push("/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Invalid credentials")
        setLoading(false)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-[#FAFAFA]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 bg-white p-8 rounded-lg shadow-subtle border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-serif">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to manage your collection</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New here? <Link href="/" className="underline text-primary">Start your subscription</Link>
        </p>
      </form>
    </main>
  )
}
