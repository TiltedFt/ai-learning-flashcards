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

  console.log('[MIDDLEWARE]', { path, hasToken: !!token, isPublic: isPublic(path) });

  // Если нет токена
  if (!token) {
    // Если это публичный путь - разрешаем доступ
    if (isPublic(path)) {
      console.log('[MIDDLEWARE] NO TOKEN, PUBLIC PATH -> NEXT');
      return NextResponse.next();
    }
    // Иначе редиректим на логин
    console.log('[MIDDLEWARE] NO TOKEN, PRIVATE PATH -> REDIRECT TO LOGIN');
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Проверяем токен
  try {
    await jwtVerify(token, secret);

    // Токен валидный - если пользователь на странице логина/регистрации или на главной,
    // редиректим его в приложение (например, на /dashboard)
    if (
      path === "/login" ||
      path.startsWith("/login/") ||
      path === "/sign-up" ||
      path.startsWith("/sign-up/") ||
      path === "/"
    ) {
      console.log('[MIDDLEWARE] HAS TOKEN, AUTH PAGE -> REDIRECT TO BOOKS');
      url.pathname = "/books"; // или другой путь вашего приложения
      return NextResponse.redirect(url);
    }

    // Иначе разрешаем доступ
    console.log('[MIDDLEWARE] HAS TOKEN, APP PAGE -> NEXT');
    return NextResponse.next();
  } catch {
    // Токен невалидный
    // Если это публичный путь - разрешаем доступ
    if (isPublic(path)) {
      console.log('[MIDDLEWARE] INVALID TOKEN, PUBLIC PATH -> NEXT');
      return NextResponse.next();
    }
    // Иначе редиректим на логин
    console.log('[MIDDLEWARE] INVALID TOKEN, PRIVATE PATH -> REDIRECT TO LOGIN');
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
