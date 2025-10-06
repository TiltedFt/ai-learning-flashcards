// src/app/books/[bookId]/chapters/[chapterId]/topics/[topicId]/practice/page.tsx
import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function PracticePage({
  params,
}: {
  params: { bookId: string; chapterId: string; topicId: string };
}) {
  const topic = await prisma.topic.findFirst({
    where: { id: params.topicId, chapterId: params.chapterId },
  });
  if (!topic) throw new Error("Topic not found");

  const questions = await prisma.question.findMany({
    where: { topicId: topic.id },
    select: { id: true, stem: true, options: true, correctIndex: true },
    take: 20,
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4">
      <Breadcrumbs
        items={[
          { href: "/books", label: "Books" },
          { href: `/books/${params.bookId}`, label: "Book" },
          {
            href: `/books/${params.bookId}/chapters/${params.chapterId}`,
            label: "Chapter",
          },
          { label: topic.title },
        ]}
      />
      <h3 className="text-lg font-semibold mb-3">{topic.title} • Quiz</h3>

      <ol className="space-y-4 list-decimal pl-5">
        {questions.map((q, i) => (
          <li key={q.id} className="rounded border p-3">
            <div className="mb-2">{q.stem}</div>
            <ul className="space-y-1">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name={`q${i}`} value={idx} />
                    <span>{opt}</span>
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="mt-4">
        <Link
          href={`/books/${params.bookId}/chapters/${params.chapterId}`}
          className="underline"
        >
          Back to topics
        </Link>
      </div>
    </main>
  );
}
