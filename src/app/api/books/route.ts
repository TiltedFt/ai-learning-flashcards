import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/api-handler";
import { bookRepository } from "@/lib/queries/book.repo";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const sp = new URL(req.url).searchParams;
  const page = Number(sp.get("page") ?? "1");
  const pageSize = Number(sp.get("pageSize") ?? "10");
  const data = await bookRepository.paginate({ page, pageSize });
  return NextResponse.json(data);
});