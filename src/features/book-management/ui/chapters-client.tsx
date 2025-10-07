"use client";

import Link from "next/link";
import { useEffect } from "react";
import AddChapterDialog from "./add-chapter-dialog";
import { Button } from "@/shared/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import {
  useChapters,
  useBooksActions,
  useDialog,
} from "@/shared/stores";

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
  }, [bookId, fetchChapters]);

  const handleChapterCreated = () => {
    invalidateChapters(bookId);
    fetchChapters(bookId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Chapters</div>
        <Button
          onClick={() => dialog.open()}
        >
          Add chapter
        </Button>
      </div>

      <AddChapterDialog
        open={dialog.isOpen}
        onOpenChange={(open) => (open ? dialog.open() : dialog.close())}
        bookId={bookId}
        onCreated={handleChapterCreated}
      />

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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>Loading…</TableCell>
              </TableRow>
            )}
            {!isLoading && chapters.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No chapters</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              chapters.map((ch) => (
                <TableRow key={ch.id}>
                  <TableCell>{ch.order}</TableCell>
                  <TableCell>{ch.title}</TableCell>
                  <TableCell>
                    {ch.pageStart}-{ch.pageEnd}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link href={`/books/${bookId}/chapters/${ch.id}`}>
                        To topics
                      </Link>
                    </Button>
                    <Button variant="destructive" disabled>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ChaptersClient;
