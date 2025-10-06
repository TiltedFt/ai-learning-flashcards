import { unstable_cache } from 'next/cache';
import { getSession } from './auth.service';
import { bookRepository } from '@/lib/db/repositories/book.repo';
import { UnauthorizedError } from '@/lib/utils/errors';

// Кешированная функция получения книги
const getCachedBook = unstable_cache(
  async (bookId: string, userId: string) => {
    return bookRepository.getWithChapters(bookId, userId);
  },
  ['book-with-chapters'],
  {
    revalidate: 300, // 5 min
    tags: (bookId: string) => [`book-${bookId}`],
  }
);

export async function getBookWithChapters(bookId: string) {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();

  return getCachedBook(bookId, session.sub);
}

// Функция для инвалидации кеша после изменений
export async function invalidateBookCache(bookId: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`book-${bookId}`);
}