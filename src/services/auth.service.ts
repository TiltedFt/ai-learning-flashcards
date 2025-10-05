import { userRepository } from "@/lib/queries/user.repo"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const ALG = "HS256"
const COOKIE = "session"
const secret = new TextEncoder().encode(process.env.AUTH_SECRET)
const maxAge = 60 * 60 * 24 * 7 // 7 days 
export type Session = { sub: string; email: string }

export async function signSession(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(process.env.AUTH_TOKEN_EXPIRES || "7d")
    .sign(secret)
}

export const sessionCookieName = COOKIE
export const sessionCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
}

export async function getSession(): Promise<Session | null> {
  const c = await cookies()
  const token = c.get(COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return { sub: String(payload.sub), email: String(payload.email) }
  } catch {
    return null
  }
}
