"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { CreateTopicInput, CreateTopicSchema } from "@/contracts/topic-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTopicInput>({
    resolver: zodResolver(CreateTopicSchema),
  });

  async function onSubmit(values: CreateTopicInput) {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/chapters/${chapterId}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Topic created");
      reset();
      onOpenChange(false);
      onCreated?.();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create topic");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}
