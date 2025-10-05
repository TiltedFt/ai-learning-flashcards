import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("session")?.value;
  // redirects unauthorized users to login page

  // only login and api allowed without token
  if (
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // verify token
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return NextResponse.next();
  } catch {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

// used by framework
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
