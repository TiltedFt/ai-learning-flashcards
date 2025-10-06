import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/shared/api/api-handler";
import { signup } from "@/core/services/auth.service";
import { SignupSchema } from "@/entities/user";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    throw parsed.error;
  }
  const user = await signup(parsed.data);

  return NextResponse.json({ user }, { status: 201 });
});
