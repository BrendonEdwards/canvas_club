import fs from "fs"
import path from "path"
import type { DBSchema, User } from "./types"

// File-backed store for local development and the pilot prototype.
// Not durable on serverless hosts; production should swap in a real database
// via the UserStore interface in lib/store.ts.
export class FileUserStore {
  private readonly dbPath: string

  constructor(dataDir?: string) {
    const dir = dataDir ?? process.env.DATA_DIR ?? path.join(process.cwd(), "data")
    this.dbPath = path.join(dir, "db.json")
  }

  private read(): DBSchema {
    try {
      const dir = path.dirname(this.dbPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      if (!fs.existsSync(this.dbPath)) {
        return { users: [] }
      }
      const raw = fs.readFileSync(this.dbPath, "utf-8")
      if (!raw.trim()) {
        return { users: [] }
      }
      return JSON.parse(raw) as DBSchema
    } catch (error) {
      console.warn("FileUserStore: unable to read db, starting empty", error)
      return { users: [] }
    }
  }

  private write(db: DBSchema): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(db, null, 2))
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = this.read()
    return db.users.find((u) => u.email === email) ?? null
  }

  async createUser(user: User): Promise<User> {
    const db = this.read()
    if (db.users.some((u) => u.email === user.email)) {
      throw new Error("USER_EXISTS")
    }
    db.users.push(user)
    this.write(db)
    return user
  }

  async updateUser(email: string, updates: Partial<User>): Promise<User | null> {
    const db = this.read()
    const index = db.users.findIndex((u) => u.email === email)
    if (index === -1) {
      return null
    }
    db.users[index] = { ...db.users[index], ...updates }
    this.write(db)
    return db.users[index]
  }
}
