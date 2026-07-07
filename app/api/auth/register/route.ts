import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getStore } from "@/lib/store"
import { emptyPreferences, toSafeUser, type User } from "@/lib/types"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session"
import { normaliseEmail } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body.email === "string" ? normaliseEmail(body.email) : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const newUser: User = {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      name: typeof body.name === "string" && body.name.trim() ? body.name.trim() : email.split("@")[0],
      joinedDate: new Date().toISOString(),
      preferences: body.preferences ?? emptyPreferences(),
      subscription: body.subscription ?? null,
    }

    try {
      const created = await getStore().createUser(newUser)
      const res = NextResponse.json(toSafeUser(created))
      res.cookies.set(SESSION_COOKIE, await createSessionToken(created.email), sessionCookieOptions())
      return res
    } catch (e) {
      if (e instanceof Error && e.message === "USER_EXISTS") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }
      throw e
    }
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
