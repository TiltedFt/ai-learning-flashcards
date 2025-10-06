import { z } from "zod";
export const CreateChapterSchema = z
  .object({
    title: z.string().min(1).max(200),
    pageStart: z.number().int().positive(),
    pageEnd: z.number().int().positive(),
  })
  .refine((v) => v.pageStart <= v.pageEnd, {
    message: "pageStart must be <= pageEnd",
    path: ["pageEnd"],
  });

export type CreateChapterInput = z.infer<typeof CreateChapterSchema>;
