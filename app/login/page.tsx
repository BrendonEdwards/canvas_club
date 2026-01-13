"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Apple, Chrome, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.")
      return
    }
    login(formData.email)
    router.push("/account")
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-serif">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Link href="/reset-password" className="text-xs text-muted-foreground underline">
              Forgot Password?
            </Link>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs uppercase text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>Or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-3">
            <Button type="button" variant="outline" className="w-full gap-2">
              <Chrome className="h-4 w-4" />
              Continue with Google
            </Button>
            <Button type="button" variant="outline" className="w-full gap-2">
              <Apple className="h-4 w-4" />
              Continue with Apple
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <p className="text-center text-sm">
          New here? <Link href="/" className="underline">Start your subscription</Link>
        </p>
      </form>
    </main>
  )
}
