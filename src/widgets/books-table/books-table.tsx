"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/shared/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import { toast } from "sonner";

export type BookItem = { id: string; title: string };

export function BooksTable({ items }: { items: BookItem[] }) {
  async function onDelete(id: string) {
    // temporary
    toast.success("Book deleted" + id);
  }

  return (
    <div className="mt-2">
      <div className="rounded-lg border">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Title</TableHead>
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
