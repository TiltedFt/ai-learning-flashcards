import { NextResponse } from "next/server";
import { logout } from "@/core/services/auth.service";

export async function POST() {
  const res = await logout();
  return NextResponse.json({ ok: res.ok }, { status: res.status });
}
