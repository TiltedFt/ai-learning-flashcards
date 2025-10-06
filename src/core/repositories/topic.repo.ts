// lib/queries/topic.repo.ts
import { CreateTopicInput } from "@/entities/topic";
import { prisma } from "@/shared/lib/db";

export const TopicRepository = {
  listTopics: (chapterId: string) => {
    return prisma.topic.findMany({
      where: { chapterId },
      orderBy: [{ order: "asc" }],
    });
  },
  createTopic: async (chapterId: string, input: CreateTopicInput) => {
    const overlap = await prisma.topic.findFirst({
      where: {
        chapterId,
        OR: [
          {
            AND: [
              { pageStart: { lte: input.pageEnd } },
              { pageEnd: { gte: input.pageStart } },
            ],
          },
        ],
      },
      select: { id: true },
    });
    if (overlap) throw new Error("Pages overlap with existing topic");

    return prisma.topic.create({
      data: { ...input, chapterId },
    });
  },
};
