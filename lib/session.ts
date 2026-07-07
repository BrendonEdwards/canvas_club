import { SignJWT, jwtVerify } from "jose"

export const SESSION_COOKIE = "canvas_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secretKey(): Uint8Array {
  // SESSION_SECRET must be set in production; the fallback keeps local dev frictionless.
  const secret = process.env.SESSION_SECRET ?? "canvas-club-dev-secret-do-not-use-in-production"
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload.sub ?? null
  } catch {
    return null
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
  }
}
