import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getStore } from "@/lib/store"
import { toSafeUser } from "@/lib/types"
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session"
import { normaliseEmail } from "@/lib/auth-server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = typeof body.email === "string" ? normaliseEmail(body.email) : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !password) {
      return NextResponse.json({ error: "Please enter your email and password" }, { status: 400 })
    }

    const user = await getStore().getUserByEmail(email)
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false
    if (!user || !valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const res = NextResponse.json(toSafeUser(user))
    res.cookies.set(SESSION_COOKIE, await createSessionToken(user.email), sessionCookieOptions())
    return res
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
