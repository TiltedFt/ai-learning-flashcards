import { CreateChapterInput } from "@/entities/chapter";
import { prisma } from "@/shared/lib/db";

export const ChapterRepository = {
  listChapters: (bookId: string) => {
    return prisma.chapter.findMany({
      where: { bookId },
      orderBy: [{ order: "asc" }],
    });
  },

  createChapter: async (bookId: string, input: CreateChapterInput) => {
    return prisma.chapter.create({
      data: { ...input, bookId },
    });
  },
};
