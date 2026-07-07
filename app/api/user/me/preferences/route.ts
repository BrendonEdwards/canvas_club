import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { getStore } from "@/lib/store"
import { toSafeUser, type Preferences } from "@/lib/types"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  }
  return NextResponse.json({ preferences: user.preferences })
}

export async function PUT(req: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const incoming = body.preferences as Partial<Preferences> | undefined
    if (!incoming) {
      return NextResponse.json({ error: "Missing preferences" }, { status: 400 })
    }
    const preferences: Preferences = {
      mainStyles: Array.isArray(incoming.mainStyles) ? incoming.mainStyles : user.preferences.mainStyles,
      subStyles: Array.isArray(incoming.subStyles) ? incoming.subStyles : user.preferences.subStyles,
      ratings: incoming.ratings && typeof incoming.ratings === "object" ? incoming.ratings : user.preferences.ratings,
      originalsInterest:
        typeof incoming.originalsInterest === "boolean"
          ? incoming.originalsInterest
          : user.preferences.originalsInterest,
    }
    const updated = await getStore().updateUser(user.email, { preferences })
    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(toSafeUser(updated))
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
