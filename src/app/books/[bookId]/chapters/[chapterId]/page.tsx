import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { prisma } from "@/lib/db";
import { TopicRepository } from "@/lib/queries/topic.repo";
import { getMyBookSummary } from "@/services/books.service";
import Link from "next/link";

export default async function ChapterPage({
  params,
}: {
  params: { bookId: string; chapterId: string };
}) {
  const book = await getMyBookSummary(params.bookId);
  const chapter = await prisma.chapter.findFirst({
    where: { id: params.chapterId, bookId: params.bookId },
  });
  if (!chapter) throw new Error("Chapter not found");
  const topics = await TopicRepository.listTopics(chapter.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-4">
      <Breadcrumbs
        items={[
          { href: "/books", label: "Books" },
          { href: `/books/${book.book.id}`, label: book.book.title },
          { label: chapter.title },
        ]}
      />
      <h2 className="text-lg font-semibold mb-2">{chapter.title}</h2>
      <ul className="space-y-2">
        {topics.map((t) => (
          <li key={t.id} className="rounded border p-3 flex justify-between">
            <div className="font-medium">{t.title}</div>
            <Link
              className="underline"
              href={`/books/${book.book.id}/chapters/${chapter.id}/topics/${t.id}/practice`}
            >
              Practice
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
