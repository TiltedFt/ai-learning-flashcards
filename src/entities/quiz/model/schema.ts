import { z } from "zod";

export const QuizSchema = z.object({
  topic: z.string(),
  questions: z.array(z.object({
    id: z.string(),
    question: z.string(),
    options: z.array(z.object({
      id: z.string(),
      text: z.string()
    })).min(3).max(6),
    correctOptionId: z.string(),
    explanation: z.string().optional()
  })).min(1)
});

export type Quiz = z.infer<typeof QuizSchema>;