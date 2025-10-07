"use client";

import { FormProvider, useForm } from "react-hook-form";
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
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { PageRangeInput } from "@/shared/ui/forms";

import { CreateChapterInput, CreateChapterSchema } from "@/entities/chapter";
import { useCreateChapter } from "../api/use-create-chapter";

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
  const { createChapter, isLoading: submitting } = useCreateChapter();

  const form = useForm<CreateChapterInput>({
    resolver: zodResolver(CreateChapterSchema),
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  async function onSubmit(values: CreateChapterInput) {
    if (values.pageEnd < values.pageStart) {
      toast.error("pageEnd must be >= pageStart");
      return;
    }

    const result = await createChapter(bookId, values);

    if (!result) {
      toast.error("Failed to create chapter");
      return;
    }

    toast.success("Chapter created");
    reset();
    onOpenChange(false);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <ErrorBoundary>
          <DialogHeader>
            <DialogTitle>Add chapter</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <PageRangeInput />

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
          </FormProvider>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
