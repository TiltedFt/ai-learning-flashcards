import { NextRequest, NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/errors";
import { CreateTopicSchema } from "@/contracts/topic-schema";
import { TopicRepository } from "@/lib/queries/topic.repo";
import { withErrorHandler } from "@/lib/api-handler";
import { getSession } from "@/services/auth.service";

export const POST = withErrorHandler(
  async (req: NextRequest, context?: { params: { chapterId: string } }) => {
    const session = await getSession();
    if (!session) throw new UnauthorizedError();

    const chapterId = context?.params?.chapterId;
    if (!chapterId) throw new Error("chapterId not provided");

    const body = await req.json();
    const parsed = CreateTopicSchema.parse(body);

    const created = await TopicRepository.createTopic(chapterId, parsed);
    return NextResponse.json(created, { status: 201 });
  }
);

export const GET = withErrorHandler(
  async (_req: NextRequest, context?: { params: { chapterId: string } }) => {
    const chapterId = context?.params?.chapterId;
    if (!chapterId) throw new Error("chapterId not provided");

    const items = await TopicRepository.listTopics(chapterId);
    return NextResponse.json(items);
  }
);
