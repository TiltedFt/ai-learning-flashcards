import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, ValidationError } from "@/shared/lib/errors";
import { CreateChapterSchema } from "@/entities/chapter";
import { ChapterRepository } from "@/core/repositories/chapter.repo";
import { getSession } from "@/core/services/auth.service";
import { withErrorHandler } from "@/shared/api/api-handler";

export const POST = withErrorHandler(
  async (req: NextRequest, context: { params: Promise<{ bookId: string }> }) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const params = await context.params;
    if (!params.bookId) {
      throw new ValidationError("Missing bookId");
    }

    const body = await req.json();
    const parsed = CreateChapterSchema.parse(body);

    const created = await ChapterRepository.createChapter(
      params.bookId,
      parsed
    );
    return NextResponse.json(created, { status: 201 });
  }
);

export const GET = withErrorHandler(
  async (_req: NextRequest, context: { params: Promise<{ bookId: string }> }) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const params = await context.params;
    if (!params.bookId) {
      throw new ValidationError("Missing bookId");
    }

    const items = await ChapterRepository.listChapters(params.bookId);
    return NextResponse.json(items);
  }
);
