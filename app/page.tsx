"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ArtSubscription from "@/art-subscription"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading || user) return null

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
