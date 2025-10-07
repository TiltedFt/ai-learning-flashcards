"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";
import type { CreateChapterInput } from "@/entities/chapter";

interface CreateChapterResponse {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
}

interface CreateChapterVariables {
  bookId: string;
  data: CreateChapterInput;
}

interface UseCreateChapterReturn {
  createChapter: (
    bookId: string,
    data: CreateChapterInput
  ) => Promise<CreateChapterResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreateChapter(): UseCreateChapterReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<
    CreateChapterResponse,
    CreateChapterVariables
  >({
    mutationFn: ({ bookId, data }) =>
      post<CreateChapterResponse>(`/api/chapters?bookId=${bookId}`, data),
  });

  const createChapter = (bookId: string, data: CreateChapterInput) =>
    mutate({ bookId, data });

  return { createChapter, isLoading, error, reset };
}
