"use client";

import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
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

export type ChapterRow = {
  id: string;
  order: number;
  title: string;
  pageStart: number;
  pageEnd: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ChaptersClient({
  bookId,
  bookTitle,
}: {
  bookId: string;
  bookTitle: string;
}) {
  const { data, isLoading, mutate } = useSWR<ChapterRow[]>(
    `/api/books/${bookId}/chapters`,
    fetcher
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Chapters</div>
        <Button onClick={() => setOpen(true)}>Add chapter</Button>
      </div>

      <AddChapterDialog
        open={open}
        onOpenChange={setOpen}
        bookId={bookId}
        onCreated={() => mutate()}
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
            {data?.map((ch) => (
              <TableRow key={ch.id}>
                <TableCell>{ch.order}</TableCell>
                <TableCell>{ch.title}</TableCell>
                <TableCell>
                  {ch.pageStart}-{ch.pageEnd}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link
                      href={`/books/${bookId}/chapters/${
                        ch.id
                      }?bookTitle=${encodeURIComponent(bookTitle)}`}
                    >
                      To topics
                    </Link>
                  </Button>
                  <Button variant="destructive" disabled>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>No chapters</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ChaptersClient;
