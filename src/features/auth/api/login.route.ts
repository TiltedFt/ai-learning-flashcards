import { LoginSchema } from "@/entities/user";
import { withErrorHandler } from "@/shared/api/api-handler";
import { login } from "@/core/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    throw parsed.error;
  }
  const { user, token } = await login(parsed.data);

  const response = NextResponse.json({ user }, { status: 200 });
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  });

  return response;
});
