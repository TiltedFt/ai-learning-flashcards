import { TopicsTable } from "@/features/book-management";
import { Breadcrumbs } from "@/shared/ui";
import { prisma } from "@/shared/lib/db";
import { PageContainer, PageHeader } from "@/shared/ui/layout";

export default async function ChapterPage({
  params,
}: {
  params: { bookId: string; chapterId: string };
}) {
  params = await params;
  const chapter = await prisma.chapter.findFirst({
    where: { id: params.chapterId, bookId: params.bookId },
    include: {
      book: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  });

  if (!chapter) throw new Error("Chapter not found");

  return (
    <PageContainer as="main" maxWidth="5xl">
      <PageHeader
        title={chapter.title}
        headingLevel={2}
        breadcrumb={
          <Breadcrumbs
            items={[
              { href: "/books", label: "Books" },
              { href: `/books/${params.bookId}`, label: chapter.book.title },
              { label: chapter.title },
            ]}
          />
        }
      />
      <TopicsTable chapterId={chapter.id} bookId={chapter.book.id} />
    </PageContainer>
  );
}
