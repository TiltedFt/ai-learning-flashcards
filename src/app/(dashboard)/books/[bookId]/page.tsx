import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getBookWithChapters } from '@/services/books.service';
import { ChapterList } from '@/components/features/chapters/chapter-list';
import { PageHeader } from '@/components/layout/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Кешируем на сервере на 5 минут
export const revalidate = 300;

interface Props {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { bookId } = await params;
  const book = await getBookWithChapters(bookId);
  
  if (!book) return { title: 'Book Not Found' };
  
  return {
    title: `${book.title} - Chapters`,
  };
}

export default async function BookPage({ params }: Props) {
  const { bookId } = await params;
  const book = await getBookWithChapters(bookId);

  if (!book) notFound();

  return (
    <main className="container mx-auto max-w-5xl px-4 py-6">
      <PageHeader
        title={book.title}
        description={book.author || undefined}
        breadcrumbs={[
          { label: 'Books', href: '/books' },
          { label: book.title },
        ]}
      />

      <Suspense fallback={<ChapterListSkeleton />}>
        <ChapterList bookId={bookId} initialData={book.chapters} />
      </Suspense>
    </main>
  );
}

function ChapterListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}