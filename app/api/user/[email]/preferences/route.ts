import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    const email = (await params).email
    const body = await request.json()

    // We expect 'preferences' in the body
    if (!body.preferences) {
        return NextResponse.json({ error: 'Missing preferences' }, { status: 400 })
    }

    const updatedUser = db.updateUser(email, { preferences: body.preferences })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { password, ...safeUser } = updatedUser
    return NextResponse.json(safeUser)
  } catch (error) {
     console.error(error)
     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
