import { CreateChapterInput } from "@/entities/chapter";
import { prisma } from "@/shared/lib/db";

export interface Chapter {
  
}

export const ChapterRepository = {
  listChapters: (bookId: string) => {
    return prisma.chapter.findMany({
      where: { bookId },
      orderBy: [{ order: "asc" }],
    });
  },

  createChapter: async (bookId: string, input: CreateChapterInput) => {
    const overlap = await prisma.chapter.findFirst({
      where: {
        bookId,
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
    if (overlap) throw new Error("Pages overlap with existing chapter");

    return prisma.chapter.create({
      data: { ...input, bookId },
    });
  },
};
