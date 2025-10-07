import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "@/shared/lib/errors";
import { prisma } from "@/shared/lib/db";
import { ensureTopicQuestions } from "@/core/services/quiz-generation.service";
import { withErrorHandler } from "@/shared/api/api-handler";
import { getSession } from "@/core/services/auth.service";

/**
 * GET /api/quiz/[topicId]
 * Fetch or generate quiz questions for a specific topic
 * Simplified route - no longer requires bookId/chapterId in path
 */
export const GET = withErrorHandler(
  async (
    _req: NextRequest,
    context?: { params: Promise<{ topicId: string }> }
  ) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const params = await context?.params;
    if (!params?.topicId) {
      throw new UnauthorizedError();
    }

    const topicId = params.topicId;

    // Fetch topic to get chapterId
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { chapterId: true },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const chapterId = topic.chapterId;

    // Check for existing questions
    const existing = await prisma.question.findMany({
      where: { chapterId, topicId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        stem: true,
        options: true,
        correctIndex: true,
        explanation: true,
      },
    });

    if (existing.length > 0) {
      return NextResponse.json({ questions: existing });
    }

    // Generate new questions if none exist
    const created = await ensureTopicQuestions(chapterId, topicId);
    return NextResponse.json({
      questions: created.map((q) => ({
        id: q.id,
        stem: q.stem,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })),
    });
  }
);
