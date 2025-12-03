import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log(`Login attempt for: ${email}`)

    const user = db.getUserByEmail(email)

    if (!user) {
        console.log("User not found")
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // In a real app, use bcrypt or argon2.
    // This is a simple mock hash for demonstration purposes.
    const hash = crypto.createHash('sha256').update(password).digest('hex')

    console.log(`Hash comparison: ${hash} vs ${user.password}`)

    if (user.password === hash) {
      // Return user info (excluding password)
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json(userWithoutPassword)
    }

    console.log("Password mismatch")
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
