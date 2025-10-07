"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";
import type { LoginInput, LoginAndSignupResponse } from "@/entities/user";

interface UseLoginReturn {
  login: (data: LoginInput) => Promise<LoginAndSignupResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useLogin(): UseLoginReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<
    LoginAndSignupResponse,
    LoginInput
  >({
    mutationFn: (data) => post<LoginAndSignupResponse>("/api/login", data),
  });

  return { login: mutate, isLoading, error, reset };
}
