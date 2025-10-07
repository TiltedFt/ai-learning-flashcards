"use client";

import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBookFormSchema,
  type CreateBookFormInput,
} from "@/entities/book";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/components/dialog";
import { Button } from "@/shared/ui/components/button";
import { FieldGroup, Field, FieldLabel } from "@/shared/ui/components/field";
import { Input } from "@/shared/ui/components/input";
import { TxtInput } from "@/shared/ui/txt-input-field";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDialog } from "@/shared/stores";

export default function CreateBookDialog() {
  const dialog = useDialog("createBook");
  const router = useRouter();
  const form = useForm<CreateBookFormInput>({
    resolver: zodResolver(CreateBookFormSchema),
    defaultValues: { title: "", author: "", file: undefined as any },
  });

  async function onSubmit(values: CreateBookFormInput) {
    const fd = new FormData();
    fd.append("title", values.title);
    if (values.author) fd.append("author", values.author);
    fd.append("file", values.file);

    const r = await fetch("/api/books", { method: "POST", body: fd });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(j.details || j.error || "Create failed");
      return;
    }
    dialog.close();
    form.reset();
    router.replace(`/books/${j.id}`);
  }

  return (
    <Dialog open={dialog.isOpen} onOpenChange={(open) => open ? dialog.open() : dialog.close()}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a book</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
            noValidate
          >
            <FieldGroup className="gap-4">
              <Field>
                <TxtInput<CreateBookFormInput> name="title" label="Title" />
              </Field>
              <Field>
                <TxtInput<CreateBookFormInput>
                  name="author"
                  label="Author (optional)"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="file">Book as PDF file</FieldLabel>
                <Controller
                  name="file"
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        id="file"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          field.onChange(f);
                        }}
                      />
                      <p
                        className={`text-xs text-red-500 min-h-4 ${
                          fieldState.error ? "" : "opacity-0"
                        }`}
                      >
                        {fieldState.error?.message || " "}
                      </p>
                    </>
                  )}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => dialog.close()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
