"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";

interface UseLogoutReturn {
  logout: () => Promise<void | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useLogout(): UseLogoutReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<void, void>({
    mutationFn: () => post("/api/logout"),
  });

  return { logout: mutate, isLoading, error, reset };
}
