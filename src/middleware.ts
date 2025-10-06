// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC = ["/login", "/sign-up", "/api"];

const isPublic = (path: string) =>
  PUBLIC.some((p) => path === p || path.startsWith(p + "/"));

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;
  const token = req.cookies.get("session")?.value;

  // Нет токена: пускаем только на public, остальное -> /login
  if (!token) {
    if (isPublic(path)) return NextResponse.next();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, secret);
  } catch {
    if (isPublic(path)) return NextResponse.next();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (
    path === "/login" ||
    path.startsWith("/login/") ||
    path === "/sign-up" ||
    path.startsWith("/sign-up/")
  ) {
    url.pathname = "/books";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// exclude systempath
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
