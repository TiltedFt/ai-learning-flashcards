import TopicsTable from "@/components/books/topics-table";
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { prisma } from "@/lib/db";
import { TopicRepository } from "@/lib/queries/topic.repo";

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
        },
      },
    },
  });

  if (!chapter) throw new Error("Chapter not found");

  return (
    <main className="mx-auto w-full max-w-5xl px-4">
      <Breadcrumbs
        items={[
          { href: "/books", label: "Books" },
          { href: `/books/${params.bookId}`, label: chapter.book.title },
          { label: chapter.title },
        ]}
      />
      <h2 className="text-lg font-semibold mb-2">{chapter.title}</h2>
      <TopicsTable chapterId={chapter.id} />
    </main>
  );
}
