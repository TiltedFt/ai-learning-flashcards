import { QuizRunner } from "@/features/quiz-practice";
import { Breadcrumbs } from "@/shared/ui";
import { prisma } from "@/shared/lib/db";

/**
 * Simplified practice page route
 * /practice/[topicId] instead of /books/[bookId]/chapters/[chapterId]/topics/[topicId]/practice
 */
export default async function PracticePage(props: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await props.params;

  // Fetch topic with nested book and chapter for breadcrumbs
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      chapter: {
        include: {
          book: {
            select: { id: true, title: true },
          },
        },
      },
    },
  });

  if (!topic) {
    return <div className="p-6">Topic not found</div>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-4">
      <Breadcrumbs
        items={[
          { href: "/books", label: "Books" },
          { href: `/books/${topic.chapter.book.id}`, label: topic.chapter.book.title },
          {
            href: `/books/${topic.chapter.book.id}/chapters/${topic.chapter.id}`,
            label: topic.chapter.title,
          },
          { label: topic.title },
        ]}
      />
      <h1 className="text-2xl font-semibold mb-4">{topic.title}</h1>
      <QuizRunner topicId={topicId} />
    </main>
  );
}
