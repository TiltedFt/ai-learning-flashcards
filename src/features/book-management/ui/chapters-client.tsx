"use client";

import Link from "next/link";
import { useEffect } from "react";
import AddChapterDialog from "./add-chapter-dialog";
import { Button } from "@/shared/ui/components/button";
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { useChapters, useBooksActions, useDialog } from "@/shared/stores";

export type ChapterRow = {
  id: string;
  order: number;
  title: string;
  pageStart: number;
  pageEnd: number;
};

export function ChaptersClient({
  bookId,
}: {
  bookId: string;
  bookTitle: string;
}) {
  const { data: chapters, isLoading } = useChapters(bookId);
  const { fetchChapters, invalidateChapters } = useBooksActions();
  const dialog = useDialog("addChapter");

  useEffect(() => {
    fetchChapters(bookId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const handleChapterCreated = () => {
    invalidateChapters(bookId);
    fetchChapters(bookId);
  };

  const columns: DataTableColumn<ChapterRow>[] = [
    {
      header: "Title",
      accessor: (ch) => ch.title,
    },
    {
      header: "Pages",
      accessor: (ch) => `${ch.pageStart}-${ch.pageEnd}`,
      className: "w-48",
    },
    {
      header: "Actions",
      accessor: (ch) => (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/books/${bookId}/chapters/${ch.id}`}>To topics</Link>
          </Button>
          <Button variant="destructive" disabled>
            Remove
          </Button>
        </div>
      ),
      className: "w-64",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">Chapters</div>
          <Button onClick={() => dialog.open()}>Add chapter</Button>
        </div>

        <AddChapterDialog
          open={dialog.isOpen}
          onOpenChange={(open) => (open ? dialog.open() : dialog.close())}
          bookId={bookId}
          onCreated={handleChapterCreated}
        />

        <DataTable
          data={chapters}
          columns={columns}
          isLoading={isLoading}
          getRowKey={(ch) => ch.id}
          emptyMessage="No chapters"
        />
      </div>
    </ErrorBoundary>
  );
}

export default ChaptersClient;
