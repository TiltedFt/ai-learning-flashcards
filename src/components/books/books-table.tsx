"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export type BookItem = { id: string; title: string; progress?: number };

export function BooksTable({ items }: { items: BookItem[] }) {
  async function onDelete(id: string) {
    // Заглушка. Можешь заменить на DELETE /api/books/:id
    toast.success("Book deleted" + id);
  }

  return (
    <div className="mt-2">
      <div className="rounded-lg border">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Title</TableHead>
              <TableHead className="w-[30%]">Progress</TableHead>
              <TableHead className="w-[20%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  <span className="block truncate" title={b.title}>
                    {b.title}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={b.progress ?? 0} className="w-48" />
                    <span className="text-xs text-muted-foreground">
                      {Math.round(b.progress ?? 0)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/books/${b.id}`}>Practice</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(b.id)}
                  >
                    Delete
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
