"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/components/button";
import AddTopicDialog from "./add-topic-dialog";
import Link from "next/link";
import { useTopics, useBooksActions, useDialog } from "@/shared/stores";
import { DataTable, type DataTableColumn } from "@/shared/ui/data-table";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

type Topic = {
  id: string;
  order: number | null;
  title: string;
  pageStart: number;
  pageEnd: number;
};

export default function TopicsTable({
  chapterId,
  bookId,
}: {
  chapterId: string;
  bookId: string;
}) {
  const { data: topics, isLoading } = useTopics(chapterId);
  const { fetchTopics, invalidateTopics } = useBooksActions();
  const dialog = useDialog("addTopic");

  useEffect(() => {
    fetchTopics(bookId, chapterId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId, chapterId]);

  const handleTopicCreated = () => {
    invalidateTopics(chapterId);
    fetchTopics(bookId, chapterId);
  };

  const columns: DataTableColumn<Topic>[] = [
    {
      header: "Order",
      accessor: (t) => t.order ?? "-",
      className: "w-20",
    },
    {
      header: "Title",
      accessor: (t) => t.title,
    },
    {
      header: "Pages",
      accessor: (t) => `${t.pageStart}–${t.pageEnd}`,
      className: "w-48",
    },
    {
      header: "Actions",
      accessor: (t) => (
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/practice/${t.id}`}>To quiz</Link>
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
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Topics</h3>
          <div className="flex gap-2">
            <Button onClick={() => dialog.open()}>Add topic</Button>
            <AddTopicDialog
              open={dialog.isOpen}
              onOpenChange={(open) => (open ? dialog.open() : dialog.close())}
              chapterId={chapterId}
              onCreated={handleTopicCreated}
            />
          </div>
        </div>

        <DataTable
          data={topics}
          columns={columns}
          isLoading={isLoading}
          getRowKey={(t) => t.id}
          emptyMessage="No topics yet"
        />
      </div>
    </ErrorBoundary>
  );
}
