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
