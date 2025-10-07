import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, ValidationError } from "@/shared/lib/errors";
import { CreateChapterSchema } from "@/entities/chapter";
import { ChapterRepository } from "@/core/repositories/chapter.repo";
import { getSession } from "@/core/services/auth.service";
import { withErrorHandler } from "@/shared/api/api-handler";
import { z } from "zod";

const QuerySchema = z.object({
  bookId: z.string().min(1, "bookId is required"),
});

/**
 * GET /api/chapters?bookId=xxx
 * Fetch all chapters for a specific book
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  const parsed = QuerySchema.parse({ bookId });

  const chapters = await ChapterRepository.listChapters(parsed.bookId);
  return NextResponse.json(chapters);
});

/**
 * POST /api/chapters?bookId=xxx
 * Create a new chapter for a specific book
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const bookId = searchParams.get("bookId");

  if (!bookId) {
    throw new ValidationError("bookId query parameter is required");
  }

  const body = await req.json();
  const parsed = CreateChapterSchema.parse(body);

  const created = await ChapterRepository.createChapter(bookId, parsed);
  return NextResponse.json(created, { status: 201 });
});
