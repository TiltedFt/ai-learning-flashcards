import { SignupInput } from "@/entities/user";
import { ConflictError, UnauthorizedError } from "@/shared/lib/errors";
import { userRepository } from "@/core/repositories/user.repo";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const ALG = "HS256";
const COOKIE = "session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const maxAge = 60 * 60 * 24 * 7; // 7 days
export type Session = { sub: string; email: string };

export async function signSession(payload: Session) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(process.env.AUTH_TOKEN_EXPIRES || "7d")
    .sign(secret);
}

export const sessionCookieName = COOKIE;
export const sessionCookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
};

export async function getSession(): Promise<Session | null> {
  const c = await cookies();
  const token = c.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return { sub: String(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}

export async function signup(input: SignupInput) {
  const { email, password, firstName, lastName } = input;
  const exists = await userRepository.findByEmailWithouthPw(email);
  if (exists) {
    throw new ConflictError("User with this email exists already.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await userRepository.create({
    email,
    passwordHash,
    firstName,
    lastName,
  });

  const token = await signSession({ sub: user.id, email: user.email });

  const c = await cookies();

  c.set(COOKIE, token, sessionCookieOpts);

  return {
    user: { id: user.id, email: user.email, firstName, lastName },
  };
}

export async function login(input: { email: string; password: string }) {
  const user = await userRepository.findByEmail(input.email);

  if (!user) {
    throw new UnauthorizedError("Wrong Email or Password.");
  }

  const match = await bcrypt.compare(input.password, user.passwordHash);
  if (!match) {
    throw new UnauthorizedError("Wrong Email or Password.");
  }

  const token = await signSession({ sub: user.id, email: user.email });

  const c = await cookies();
  c.set(COOKIE, token, sessionCookieOpts);

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user.id,
    },
    token,
  };
}

export async function logout() {
  const c = await cookies();
  c.set(COOKIE, "", { ...sessionCookieOpts, maxAge: 0 });
  return { ok: true as const, status: 200 };
}
