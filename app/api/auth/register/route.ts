import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { User } from '@/lib/types'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Minimal validation
    if (!body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In a real app, use bcrypt or argon2.
    // This is a simple mock hash for demonstration purposes.
    const hashedPassword = crypto.createHash('sha256').update(body.password).digest('hex')

    const newUser: User = {
      email: body.email,
      password: hashedPassword,
      name: body.name || body.email.split('@')[0],
      joinedDate: new Date().toISOString(),
      preferences: body.preferences || { mainStyles: [], subStyles: [], ratings: {} },
      subscription: body.subscription || null,
      currentRotation: [] // Initially empty
    }

    try {
      const createdUser = db.createUser(newUser)
      const { password: _, ...safeUser } = createdUser
      return NextResponse.json(safeUser)
    } catch (e: any) {
      if (e.message === 'User already exists') {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }
      throw e
    }

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
