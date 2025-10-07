"use client";

import { post } from "@/shared/api/client";
import { useApiMutation } from "@/shared/hooks/use-api-mutation";
import type { SignupInput, LoginAndSignupResponse } from "@/entities/user";

interface UseSignupReturn {
  signup: (data: SignupInput) => Promise<LoginAndSignupResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useSignup(): UseSignupReturn {
  const { mutate, isLoading, error, reset } = useApiMutation<
    LoginAndSignupResponse,
    SignupInput
  >({
    mutationFn: (data) => post<LoginAndSignupResponse>("/api/sign-up", data),
  });

  return { signup: mutate, isLoading, error, reset };
}
