import { getSession } from "@/core/services/auth.service";
import { NotFoundError, UnauthorizedError } from "@/shared/lib/errors";
import { bookRepository } from "@/core/repositories/book.repo";

export async function getMyPaginatedBooks(params: {
  page?: number;
  pageSize?: number;
}) {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return bookRepository.paginate({ ...params, userId: session.sub });
}

export async function getMyBookSummary(bookId: string) {
  const session = await getSession();
  if (!session) throw new UnauthorizedError("Unauthorized");
  const data = await bookRepository.summaryById(bookId, session.sub);
  if (!data) throw new NotFoundError("Book not found");
  return data;
}
