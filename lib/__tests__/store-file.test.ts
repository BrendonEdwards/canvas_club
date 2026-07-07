import { describe, it, expect, beforeEach, afterEach } from "vitest"
import fs from "fs"
import os from "os"
import path from "path"
import { FileUserStore } from "@/lib/store-file"
import { emptyPreferences, type User } from "@/lib/types"

let dir: string
let store: FileUserStore

function makeUser(email: string): User {
  return {
    email,
    passwordHash: "hash",
    name: "Test",
    joinedDate: new Date().toISOString(),
    preferences: emptyPreferences(),
    subscription: null,
  }
}

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "canvas-store-"))
  store = new FileUserStore(dir)
})

afterEach(() => {
  fs.rmSync(dir, { recursive: true, force: true })
})

describe("FileUserStore", () => {
  it("creates and retrieves a user", async () => {
    await store.createUser(makeUser("a@b.com"))
    const user = await store.getUserByEmail("a@b.com")
    expect(user?.name).toBe("Test")
  })

  it("returns null for unknown users", async () => {
    expect(await store.getUserByEmail("nobody@b.com")).toBeNull()
  })

  it("rejects duplicate emails with USER_EXISTS", async () => {
    await store.createUser(makeUser("a@b.com"))
    await expect(store.createUser(makeUser("a@b.com"))).rejects.toThrow("USER_EXISTS")
  })

  it("merges updates and persists them", async () => {
    await store.createUser(makeUser("a@b.com"))
    const updated = await store.updateUser("a@b.com", {
      preferences: { mainStyles: ["cubism"], subStyles: ["analytical"], ratings: { x: "love" } },
    })
    expect(updated?.preferences.mainStyles).toEqual(["cubism"])
    // fresh store instance reads from disk
    const fresh = new FileUserStore(dir)
    const reread = await fresh.getUserByEmail("a@b.com")
    expect(reread?.preferences.subStyles).toEqual(["analytical"])
    expect(reread?.name).toBe("Test")
  })

  it("returns null when updating an unknown user", async () => {
    expect(await store.updateUser("nobody@b.com", { name: "X" })).toBeNull()
  })
})
