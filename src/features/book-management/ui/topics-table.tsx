"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/components/button";
import AddTopicDialog from "./add-topic-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/ui/components/table";
import Link from "next/link";
import { useTopics, useBooksActions, useDialog } from "@/shared/stores";

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
  }, [bookId, chapterId, fetchTopics]);

  const handleTopicCreated = () => {
    invalidateTopics(chapterId);
    fetchTopics(bookId, chapterId);
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Topics</h3>
        <div className="flex gap-2">
          <Button onClick={() => dialog.open()}>Add topic</Button>
          <AddTopicDialog
            open={dialog.isOpen}
            onOpenChange={(open) => (open ? dialog.open() : dialog.close())}
            chapterId={chapterId}
            bookId={bookId}
            onCreated={handleTopicCreated}
          />
        </div>
      </div>

      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-48">Pages</TableHead>
              <TableHead className="w-64">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading…</TableCell>
              </TableRow>
            ) : topics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No topics yet</TableCell>
              </TableRow>
            ) : (
              topics.map((t, i) => (
                <TableRow key={t.id}>
                  <TableCell>{t.order ?? i + 1}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    {t.pageStart}–{t.pageEnd}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/practice/${t.id}`}>To quiz</Link>
                    </Button>
                    <Button variant="destructive" disabled>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
