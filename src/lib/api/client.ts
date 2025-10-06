class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.error || "Request failed",
      response.status,
      error.code
    );
  }

  return response.json();
}

export const apiClient = {
  get: <T>(url: string) => fetchJSON<T>(url, { method: "GET" }),
  post: <T>(url: string, data?: unknown) =>
    fetchJSON<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: <T>(url: string, data?: unknown) =>
    fetchJSON<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: <T>(url: string) => fetchJSON<T>(url, { method: "DELETE" }),
};
