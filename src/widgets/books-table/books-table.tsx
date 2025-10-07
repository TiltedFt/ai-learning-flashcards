"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/components/button";
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { toast } from "sonner";

export type BookItem = { id: string; title: string };

export function BooksTable({ items }: { items: BookItem[] }) {
  async function onDelete(id: string) {
    // temporary
    toast.success("Book deleted" + id);
  }

  const columns: DataTableColumn<BookItem>[] = [
    {
      header: "Title",
      accessor: (book) => (
        <span className="block truncate font-medium" title={book.title}>
          {book.title}
        </span>
      ),
      className: "w-[50%]",
    },
    {
      header: "Actions",
      accessor: (book) => (
        <div className="space-x-2">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/books/${book.id}`}>Practice</Link>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(book.id)}>
            Delete
          </Button>
        </div>
      ),
      className: "w-[20%]",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="mt-2">
        <DataTable
          data={items}
          columns={columns}
          getRowKey={(book) => book.id}
          emptyMessage="No books available"
          className="table-fixed w-full"
        />
      </div>
    </ErrorBoundary>
  );
}
