import { prisma } from "@/shared/lib/db";
import { Breadcrumbs } from "@/shared/ui";
import { ChaptersClient } from "@/features/book-management";

export default async function BookPage({
  params,
}: {
  params: { bookId: string };
}) {
  const { bookId } = await params;
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true, title: true },
  });
  if (!book) return null;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-4">
      <Breadcrumbs
        items={[{ href: "/books", label: "Books" }, { label: book.title }]}
      />
      <h1 className="text-2xl font-semibold mb-4">{book.title}</h1>
      <ChaptersClient bookId={book.id} bookTitle={book.title} />
    </main>
  );
}
