import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const user = db.getUserByEmail(email)

    // In a real app, use bcrypt or argon2.
    // This is a simple mock hash for demonstration purposes.
    const hash = crypto.createHash('sha256').update(password).digest('hex')

    if (user && user.password === hash) {
      // Return user info (excluding password)
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
