import Link from "next/link";
import { Button } from "@/shared/ui/components/button";
import { BooksTable } from "@/widgets/books-table";
import { getMyPaginatedBooks } from "@/core/services/books.service";
import { unstable_noStore as noStore } from "next/cache";
import { AutoPageSize } from "@/widgets/pagination";
import { CreateBookDialog } from "@/features/book-management";
import { PageContainer, PageHeader } from "@/shared/ui/layout";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Books({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; pageSize?: string }>;
}) {
  noStore();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(sp?.pageSize ?? 10)));

  const data = await getMyPaginatedBooks({ page, pageSize });

  return (
    <PageContainer as="main" maxWidth="5xl">
      <AutoPageSize page={page} pageSize={pageSize} />

      <PageHeader
        title="Books"
        description="Manage your learning materials and book collections"
        actions={<CreateBookDialog />}
      />

      <BooksTable items={data.items} />

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {page} of {data.pages} • {data.total} total
        </span>
        <div className="flex gap-2">
          {page > 1 ? (
            <Button asChild variant="outline">
              <Link href={`/books?page=${page - 1}&pageSize=${pageSize}`}>
                Prev
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Prev
            </Button>
          )}

          {page < data.pages ? (
            <Button asChild variant="outline">
              <Link href={`/books?page=${page + 1}&pageSize=${pageSize}`}>
                Next
              </Link>
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
