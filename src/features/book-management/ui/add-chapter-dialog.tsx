"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";

import {
  CreateChapterInput,
  CreateChapterSchema,
} from "@/entities/chapter";

export default function AddChapterDialog({
  open,
  onOpenChange,
  bookId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookId: string;
  onCreated?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChapterInput>({
    resolver: zodResolver(CreateChapterSchema),
  });

  async function onSubmit(values: CreateChapterInput) {
    if (values.pageEnd < values.pageStart) {
      toast.error("pageEnd must be >= pageStart");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/books/${bookId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Failed to create chapter");
        return;
      }

      toast.success("Chapter created");
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add chapter</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Page Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="pageStart">Page start</Label>
              <Input
                id="pageStart"
                type="number"
                {...register("pageStart", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {errors.pageStart && (
                <p className="text-sm text-red-600">
                  {errors.pageStart.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="pageEnd">Page end</Label>
              <Input
                id="pageEnd"
                type="number"
                {...register("pageEnd", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
              />
              {errors.pageEnd && (
                <p className="text-sm text-red-600">{errors.pageEnd.message}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
