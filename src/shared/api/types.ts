import { NextRequest, NextResponse } from "next/server";

/**
 * Route context with typed params
 */
export type RouteContext<TParams = Record<string, string>> = {
  params: Promise<TParams>;
};

/**
 * API Route Handler type
 */
export type ApiHandler<TParams = Record<string, string>> = (
  req: NextRequest,
  context: RouteContext<TParams>
) => Promise<NextResponse>;

/**
 * Generic API Response
 */
export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: string; code?: string };

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pages: number;
}

/**
 * API Error type
 */
export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: unknown;
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  status = 500,
  code?: string
): NextResponse {
  return NextResponse.json({ error, code }, { status });
}
