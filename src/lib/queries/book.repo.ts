import { prisma } from "@/lib/db";

export type BookRow = { id: string; title: string };

export interface CreateBook {
  title: string;
  author: string | null | undefined;
  fileUrl?: string;
  userId: string;
}

export interface BookPaginateParams {
  page?: number;
  pageSize?: number;
  userId: string;
}

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
};
