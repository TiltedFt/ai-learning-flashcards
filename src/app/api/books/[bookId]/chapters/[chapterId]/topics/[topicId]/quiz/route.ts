import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureTopicQuestions } from "@/lib/quiz-generation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ chapterId: string; topicId: string }> }
) {
  const { chapterId, topicId } = await params;

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
