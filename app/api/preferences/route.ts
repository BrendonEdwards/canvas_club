import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'preferences.json')

async function readData() {
  try {
    const text = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email') || ''
  const data = await readData()
  const result = email ? data[email] || [] : data
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, preferences } = body
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  const data = await readData()
  data[email] = preferences
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
  return NextResponse.json({ success: true })
}
