"use client"

import ArtSubscription from "../art-subscription.tsx"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user } = useAuth()
  return (
    <main>
      <div className="p-4 text-right">
        {user ? (
          <Link href="/account" className="text-sm underline">
            Manage your account
          </Link>
        ) : (
          <Link href="/login" className="text-sm underline">
            Returning customer? Log in
          </Link>
        )}
      </div>
      <ArtSubscription />
    </main>
  )
}
