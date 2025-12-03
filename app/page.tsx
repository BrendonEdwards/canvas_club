"use client"

import ArtSubscription from "../art-subscription.tsx"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) return null // Or a loading spinner while redirecting

  return (
    <main>
      <div className="absolute top-4 right-4 z-10">
          <Link href="/login" className="text-sm font-medium hover:underline">
            Returning customer? Log in
          </Link>
      </div>
      <ArtSubscription />
    </main>
  )
}
