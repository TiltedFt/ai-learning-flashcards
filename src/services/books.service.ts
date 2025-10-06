import { getSession } from "@/services/auth.service";
import { UnauthorizedError } from "@/lib/errors";
import { bookRepository } from "@/lib/queries/book.repo";

export async function getMyPaginatedBooks(params: {
  page?: number;
  pageSize?: number;
}) {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return bookRepository.paginate({ ...params, userId: session.sub });
}
