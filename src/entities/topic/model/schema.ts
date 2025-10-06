import { z } from "zod";
export const CreateTopicSchema = z
  .object({
    title: z.string().min(1).max(200),
    pageStart: z.number().int().positive(),
    pageEnd: z.number().int().positive(),
    order: z.number().int().min(0).optional(),
  })
  .refine((v) => v.pageStart <= v.pageEnd, {
    message: "pageStart must be <= pageEnd",
    path: ["pageEnd"],
  });

export type CreateTopicInput = z.infer<typeof CreateTopicSchema>;
