 nqyrrk-codex/add-login-page-for-registration
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

import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import { join } from 'path'

const filePath = join(process.cwd(), 'lib', 'preferences.json')

export async function POST(request: Request) {
  const data = await request.json()
  try {
    const file = await fs.readFile(filePath, 'utf8')
    const json = file ? JSON.parse(file) : {}
    json[data.email ?? 'unknown'] = data.ratings
    await fs.writeFile(filePath, JSON.stringify(json, null, 2))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Unable to save preferences' }, { status: 500 })
  }
}
 main
