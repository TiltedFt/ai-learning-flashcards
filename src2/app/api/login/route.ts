import { LoginSchema, SignupSchema } from "@/contracts/auth-schema";
import { withErrorHandler } from "@/lib/api-handler";
import { login } from "@/services/auth.service";
import { NextRequest, NextResponse } from "next/server";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    throw parsed.error;
  }
  const user = await login(parsed.data);
 
  return NextResponse.json({ user }, { status: 200 });
});
