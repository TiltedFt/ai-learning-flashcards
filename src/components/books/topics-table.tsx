"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AddTopicDialog from "./add-topic-dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  order: number;
};

export default function TopicsTable({
  chapterId,
  bookId,
}: {
  chapterId: string;
  bookId: string;
}) {
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [open, setOpen] = useState(false);

  async function fetchTopics() {
    const res = await fetch(`/api/chapters/${chapterId}/topics`);
    if (res.ok) {
      const data = await res.json();
      setTopics(data);
    }
  }

  useEffect(() => {
    fetchTopics();
  }, [chapterId]);

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Topics</h3>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Add topic</Button>
          <AddTopicDialog
            open={open}
            onOpenChange={setOpen}
            chapterId={chapterId}
            onCreated={fetchTopics}
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
            {topics === null ? (
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
                      <Link
                        href={`/books/${bookId}/chapters/${chapterId}/topics/${t.id}/practice`}
                      >
                        To quiz
                      </Link>
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
