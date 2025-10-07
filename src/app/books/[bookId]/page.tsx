import { prisma } from "@/shared/lib/db";
import { Breadcrumbs } from "@/shared/ui";
import { ChaptersClient } from "@/features/book-management";
import { PageContainer, PageHeader } from "@/shared/ui/layout";

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
    <PageContainer as="main" maxWidth="5xl">
      <PageHeader
        title={book.title}
        breadcrumb={
          <Breadcrumbs
            items={[{ href: "/books", label: "Books" }, { label: book.title }]}
          />
        }
      />
      <ChaptersClient bookId={book.id} bookTitle={book.title} />
    </PageContainer>
  );
}
