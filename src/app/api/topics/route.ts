import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, ValidationError } from "@/shared/lib/errors";
import { CreateTopicSchema } from "@/entities/topic";
import { TopicRepository } from "@/core/repositories/topic.repo";
import { withErrorHandler } from "@/shared/api/api-handler";
import { getSession } from "@/core/services/auth.service";
import { z } from "zod";

const QuerySchema = z.object({
  chapterId: z.string().min(1, "chapterId is required"),
});

/**
 * GET /api/topics?chapterId=xxx
 * Fetch all topics for a specific chapter
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get("chapterId");

  const parsed = QuerySchema.parse({ chapterId });

  const topics = await TopicRepository.listTopics(parsed.chapterId);
  return NextResponse.json(topics);
});

/**
 * POST /api/topics?chapterId=xxx
 * Create a new topic for a specific chapter
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  const { searchParams } = new URL(req.url);
  const chapterId = searchParams.get("chapterId");

  if (!chapterId) {
    throw new ValidationError("chapterId query parameter is required");
  }

  const body = await req.json();
  const parsed = CreateTopicSchema.parse(body);

  const created = await TopicRepository.createTopic(chapterId, parsed);
  return NextResponse.json(created, { status: 201 });
});
