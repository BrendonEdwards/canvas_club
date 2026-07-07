import { describe, it, expect } from "vitest"
import { createSessionToken, verifySessionToken } from "@/lib/session"

describe("session tokens", () => {
  it("round-trips the email", async () => {
    const token = await createSessionToken("a@b.com")
    expect(await verifySessionToken(token)).toBe("a@b.com")
  })

  it("rejects tampered tokens", async () => {
    const token = await createSessionToken("a@b.com")
    const tampered = token.slice(0, -2) + "xx"
    expect(await verifySessionToken(tampered)).toBeNull()
  })

  it("rejects garbage", async () => {
    expect(await verifySessionToken("not-a-jwt")).toBeNull()
  })
})
