import { toast } from "sonner";

/**
 * Централизованные notifications
 */
export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  warning: (message: string) => toast.warning(message),
  loading: (message: string) => toast.loading(message),
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => toast.promise(promise, messages),
};

/**
 * Handle API error response
 */
export function handleApiError(error: string | undefined, fallback = "An error occurred") {
  notify.error(error || fallback);
}

/**
 * Handle form validation errors
 */
export function handleFormErrors(errors: Record<string, { message?: string }>) {
  Object.values(errors).forEach((error) => {
    if (error.message) {
      notify.error(error.message);
    }
  });
}
