"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";
import type { CreateTopicInput } from "@/entities/topic";

interface CreateTopicResponse {
  id: string;
  title: string;
  pageStart: number;
  pageEnd: number;
  order?: number;
}

interface CreateTopicVariables {
  chapterId: string;
  data: CreateTopicInput;
}

interface UseCreateTopicReturn {
  createTopic: (
    chapterId: string,
    data: CreateTopicInput
  ) => Promise<CreateTopicResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreateTopic(): UseCreateTopicReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<
    CreateTopicResponse,
    CreateTopicVariables
  >({
    mutationFn: ({ chapterId, data }) =>
      post<CreateTopicResponse>(`/api/topics?chapterId=${chapterId}`, data),
  });

  const createTopic = (chapterId: string, data: CreateTopicInput) =>
    mutate({ chapterId, data });

  return { createTopic, isLoading, error, reset };
}
