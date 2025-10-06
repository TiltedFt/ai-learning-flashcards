import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { signup } from "@/services/auth.service";
import { SignupSchema } from "@/contracts/auth-schema";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    throw parsed.error;
  }
  const user = await signup(parsed.data);

  return NextResponse.json({ user }, { status: 201 });
});
