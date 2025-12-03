import fs from 'fs'
import path from 'path'
import { DBSchema, User } from './types'

// NOTE: This file-based database is for local development and prototyping purposes only.
// In a production environment (especially serverless), use a real database (Postgres, MongoDB, etc.)
// as the local filesystem is ephemeral and data will not persist.
const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

function getDB(): DBSchema {
  // Ensure data directory exists
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDB: DBSchema = { users: [] }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2))
    return initialDB
  }
  const fileContent = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(fileContent)
}

function saveDB(db: DBSchema) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

export const db = {
  getUsers: () => getDB().users,
  getUserByEmail: (email: string) => getDB().users.find((u) => u.email === email),
  createUser: (user: User) => {
    const database = getDB()
    // Check if user exists
    if (database.users.some(u => u.email === user.email)) {
      throw new Error('User already exists')
    }
    database.users.push(user)
    saveDB(database)
    return user
  },
  updateUser: (email: string, updates: Partial<User>) => {
    const database = getDB()
    const index = database.users.findIndex((u) => u.email === email)
    if (index === -1) return null

    database.users[index] = { ...database.users[index], ...updates }
    saveDB(database)
    return database.users[index]
  }
}
