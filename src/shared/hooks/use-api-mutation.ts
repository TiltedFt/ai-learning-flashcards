"use client";

import { useState, useCallback } from "react";
import type { ApiResponse } from "@/shared/types";

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
}

interface UseApiMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  isLoading: boolean;
  error: string | null;
  data: TData | null;
  reset: () => void;
}

export function useApiMutation<TData = unknown, TVariables = void>({
  mutationFn,
  onSuccess,
  onError,
}: UseApiMutationOptions<TData, TVariables>): UseApiMutationReturn<
  TData,
  TVariables
> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);

        if (response.error) {
          setError(response.error);
          onError?.(response.error);
          return null;
        }

        const resultData = response.data ?? null;
        setData(resultData);

        if (resultData) {
          onSuccess?.(resultData);
        }

        return resultData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  return { mutate, isLoading, error, data, reset };
}
