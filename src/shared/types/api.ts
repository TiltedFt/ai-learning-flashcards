export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface MutationState<T = unknown> {
  isLoading: boolean;
  error: string | null;
  data: T | null;
}
