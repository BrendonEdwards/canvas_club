import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/auth-server"
import { toSafeUser } from "@/lib/types"

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 })
  }
  return NextResponse.json(toSafeUser(user))
}
