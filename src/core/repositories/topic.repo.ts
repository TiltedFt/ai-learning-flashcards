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
    return prisma.topic.create({
      data: { ...input, chapterId },
    });
  },
};
