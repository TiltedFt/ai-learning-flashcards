import { ApiResponse } from "./types";

/**
 * Централизованный API client с обработкой ошибок
 */
export async function apiClient<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || data.message || `Request failed with status ${response.status}`,
        code: data.code,
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * GET request
 */
export async function get<T>(url: string): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "GET" });
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiClient<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function del<T>(url: string): Promise<ApiResponse<T>> {
  return apiClient<T>(url, { method: "DELETE" });
}
