"use client"

import ArtSubscription from "../art-subscription.tsx"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function Page() {
  const { user } = useAuth()
  return (
    <main>
 nqyrrk-codex/add-login-page-for-registration
      <div className="p-4 text-right space-x-4">
        {user ? (
          <>
            <Link href="/account" className="text-sm underline">
              Account
            </Link>
            <Link href="/order" className="text-sm underline">
              Order Prints
            </Link>
          </>

      <div className="p-4 text-right">
        {user ? (
          <Link href="/account" className="text-sm underline">
            Manage your account
          </Link>
 main
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
