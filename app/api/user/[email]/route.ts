import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  const email = (await params).email
  const user = db.getUserByEmail(email)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { password, ...safeUser } = user
  return NextResponse.json(safeUser)
}
