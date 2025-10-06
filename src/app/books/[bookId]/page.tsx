import { Breadcrumbs } from "@/components/nav/breadcrumbs";
import { getMyBookSummary } from "@/services/books.service";
import Link from "next/link";

export default async function BookPage({
  params,
}: {
  params: { bookId: string };
}) {
  const data = await getMyBookSummary((await params).bookId);
  return (
    <main className="mx-auto w-full max-w-5xl px-4">
      <Breadcrumbs
        items={[{ href: "/books", label: "Books" }, { label: data.book.title }]}
      />
      <h1 className="text-xl font-semibold mb-2">{data.book.title}</h1>
      <ul className="space-y-2">
        {data.chapters.map((c) => (
          <li key={c.id} className="rounded border p-3 flex justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">
                pages {c.pageStart}–{c.pageEnd} • topics {c.topicCount}
              </div>
            </div>
            <Link
              className="underline"
              href={`/books/${data.book.id}/chapters/${c.id}`}
            >
              toTopics
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
