import { prisma } from "@/shared/lib/db";

export type BookRow = { id: string; title: string };

export interface CreateBook {
  title: string;
  author: string | null | undefined;
  fileUrl?: string;
  userId: string;
}

export type ChapterCreate = {
  title: string;
  order: number;
  pageStart: number;
  pageEnd: number;
};

export interface BookPaginateParams {
  page?: number;
  pageSize?: number;
  userId: string;
}

export type ChapterSummary = {
  id: string;
  title: string | null;
  order: number | null;
  pageStart: number | null;
  pageEnd: number | null;
  topicCount: number;
};

export type BookSummary = {
  book: { id: string; title: string; author: string | null };
  chapters: ChapterSummary[];
  stats: { chapters: number; topics: number; questions: number };
};

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}
export const bookRepository = {
  create: (data: CreateBook) => prisma.book.create({ data }),

  async paginate({
    page = 1,
    pageSize = 10,
    userId,
  }: BookPaginateParams): Promise<Paginated<BookRow>> {
    const take = Math.max(1, Math.min(100, Number(pageSize) || 10));
    const p = Math.max(1, Number(page) || 1);
    const skip = (p - 1) * take;

    const [items, total] = await prisma.$transaction([
      prisma.book.findMany({
        skip,
        take,
        orderBy: { createdAt: "asc" },
        select: { id: true, title: true },
        where: { userId },
      }),
      prisma.book.count({ where: { userId } }),
    ]);

    return {
      items,
      page: p,
      pageSize: take,
      total,
      pages: Math.max(1, Math.ceil(total / take)),
    };
  },

  updatePath: async (id: string, path: string) => {
    return await prisma.$transaction([
      prisma.book.update({
        where: {
          id: id,
        },
        data: {
          fileUrl: path,
        },
      }),
    ]);
  },

  async summaryById(
    bookId: string,
    userId: string
  ): Promise<BookSummary | null> {
    const book = await prisma.book.findFirst({
      where: { id: bookId, userId },
      select: { id: true, title: true, author: true },
    });
    if (!book) return null;

    const chapters = await prisma.chapter.findMany({
      where: { bookId },
      orderBy: [{ order: "asc" }, { pageStart: "asc" }],
      select: {
        id: true,
        title: true,
        order: true,
        pageStart: true,
        pageEnd: true,
        _count: { select: { topics: true } }, // имя relation: Topics
      },
    });

    const topics = await prisma.topic.count({ where: { chapter: { bookId } } });
    const questions = await prisma.question.count({
      where: { topic: { chapter: { bookId } } },
    });

    return {
      book,
      chapters: chapters.map((c) => ({
        id: c.id,
        title: c.title,
        order: c.order,
        pageStart: c.pageStart,
        pageEnd: c.pageEnd,
        topicCount: c._count.topics,
      })),
      stats: { chapters: chapters.length, topics, questions },
    };
  },

  async hasChapters(bookId: string) {
    const n = await prisma.chapter.count({ where: { bookId } });
    return n > 0;
  },

  async bulkCreateChapters(bookId: string, items: ChapterCreate[]) {
    if (!items.length) return 0;
    const data = items.map((x) => ({ bookId, ...x }));
    const res = await prisma.chapter.createMany({ data, skipDuplicates: true });
    return res.count;
  },
};
