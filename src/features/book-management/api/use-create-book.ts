"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";
import type { CreateBookFormInput } from "@/entities/book";

interface CreateBookResponse {
  id: string;
  title: string;
  author?: string | null;
}

interface UseCreateBookReturn {
  createBook: (data: CreateBookFormInput) => Promise<CreateBookResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreateBook(): UseCreateBookReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<
    CreateBookResponse,
    CreateBookFormInput
  >({
    mutationFn: (data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.author) formData.append("author", data.author);
      formData.append("file", data.file);

      return post<CreateBookResponse>("/api/books", formData);
    },
  });

  return { createBook: mutate, isLoading, error, reset };
}
