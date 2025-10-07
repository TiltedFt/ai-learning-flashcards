"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTopicInput, CreateTopicSchema } from "@/entities/topic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { Label } from "@/shared/ui/components/label";
import { Input } from "@/shared/ui/components/input";
import { Button } from "@/shared/ui/components/button";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { toast } from "sonner";
import { useCreateTopic } from "../api/use-create-topic";

export default function AddTopicDialog({
  open,
  onOpenChange,
  chapterId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  chapterId: string;
  onCreated?: () => void;
}) {
  const { createTopic, isLoading: submitting } = useCreateTopic();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTopicInput>({
    resolver: zodResolver(CreateTopicSchema),
  });

  async function onSubmit(values: CreateTopicInput) {
    const result = await createTopic(chapterId, values);

    if (!result) {
      toast.error("Failed to create topic");
      return;
    }

    toast.success("Topic created");
    reset();
    onOpenChange(false);
    onCreated?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ErrorBoundary>
          <DialogHeader>
            <DialogTitle>Add topic</DialogTitle>
          </DialogHeader>
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <Label>Title</Label>
              <Input {...register("title")} />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Page start</Label>
                <Input
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
                <Label>Page end</Label>
                <Input
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
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
