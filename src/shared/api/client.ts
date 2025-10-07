import { ApiResponse } from "./types";

/**
 * API Client configuration
 */
interface ClientConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

const DEFAULT_CONFIG: Required<ClientConfig> = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 30000, // 30 seconds
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// is network error and should be retried
function isRetryableError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }
  return false;
}

// Main API client function
export async function apiClient<T>(
  url: string,
  options?: RequestInit & { config?: ClientConfig }
): Promise<ApiResponse<T>> {
  const config = { ...DEFAULT_CONFIG, ...options?.config };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      // Determine if body is FormData
      const isFormData = options?.body instanceof FormData;

      const headers: HeadersInit = {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...options?.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Always include credentials
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Try to parse JSON response
      let data: unknown;
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        return {
          error:
            (data as { error?: string })?.error ||
            (data as { message?: string })?.message ||
            `Request failed with status ${response.status}`,
          code: (data as { code?: string })?.code,
        };
      }

      return { data: data as T };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      // Handle timeout
      if (lastError.name === "AbortError") {
        return {
          error: `Request timeout after ${config.timeout}ms`,
        };
      }

      // Retry logic for network errors
      if (isRetryableError(error) && attempt < config.maxRetries) {
        const delay = config.retryDelay * Math.pow(2, attempt); // Exponential backoff
        await sleep(delay);
        continue;
      }

      // If not retryable or max retries reached
      break;
    }
  }

  return {
    error: lastError?.message || "Network error occurred",
  };
}

export async function get<T>(
  url: string,
  config?: ClientConfig
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "GET", config });
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: ClientConfig
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
    config,
  });
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: ClientConfig
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
    config,
  });
}

export async function patch<T>(
  url: string,
  body?: unknown,
  config?: ClientConfig
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
    config,
  });
}

export async function del<T>(
  url: string,
  config?: ClientConfig
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "DELETE", config });
}
