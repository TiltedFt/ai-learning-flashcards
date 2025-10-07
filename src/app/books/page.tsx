import { BooksTable } from "@/widgets/books-table";
import { getMyPaginatedBooks } from "@/core/services/books.service";
import { unstable_noStore as noStore } from "next/cache";
import { AutoPageSize } from "@/widgets/pagination";
import { CreateBookDialog } from "@/features/book-management";
import { PageContainer, PageHeader } from "@/shared/ui/layout";
import { DataTablePagination } from "@/shared/ui/data-table";

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

      <DataTablePagination
        pagination={{
          currentPage: page,
          totalPages: data.pages,
          totalItems: data.total,
          pageSize,
        }}
        baseUrl="/books"
      />
    </PageContainer>
  );
}
