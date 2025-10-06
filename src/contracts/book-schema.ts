import { z } from "zod";

export const CreateBookFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).trim(),
  author: z.string().max(200).trim().optional(),
  file: z
    .instanceof(File, { message: "PDF file is required" })
    .refine((f) => f.type === "application/pdf", "Only PDF allowed")
    .refine((f) => f.size <= 25 * 1024 * 1024, "Max 25MB"),
});

export const CreateBookServerSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  author: z.string().max(200).trim().nullish().optional(),
});
export type CreateBookFormInput = z.infer<typeof CreateBookFormSchema>;
export type CreateBookServerInput = z.infer<typeof CreateBookServerSchema>;
