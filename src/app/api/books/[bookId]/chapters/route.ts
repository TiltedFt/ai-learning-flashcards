import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/errors";
import { CreateChapterSchema } from "@/contracts/chapter-schema";
import { ChapterRepository } from "@/lib/queries/chapter.repo";
import { getSession } from "@/services/auth.service";
import { withErrorHandler } from "@/lib/api-handler";

export const POST = withErrorHandler(
  async (req: NextRequest, context?: { params: { bookId: string } }) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const bookId = context?.params?.bookId;
    if (!bookId) throw new Error("bookId not provided");

    const body = await req.json();
    const parsed = CreateChapterSchema.parse(body);

    const created = await ChapterRepository.createChapter(bookId, parsed);
    return NextResponse.json(created, { status: 201 });
  }
);

export const GET = withErrorHandler(
  async (_req: NextRequest, context?: { params: { bookId: string } }) => {
    const bookId = context?.params?.bookId;
    if (!bookId) throw new Error("bookId not provided");

    const items = await ChapterRepository.listChapters(bookId);
    return NextResponse.json(items);
  }
);
