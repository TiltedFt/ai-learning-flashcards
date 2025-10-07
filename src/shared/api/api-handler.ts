import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/shared/lib/errors";
import { Prisma } from "@prisma/client";
import { ApiHandler, RouteContext } from "./types";

export function withErrorHandler<TParams = Record<string, string>>(
  handler: ApiHandler<TParams>
): ApiHandler<TParams> {
  return async (req: NextRequest, context?: RouteContext<TParams>) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }

      // zod and custom validation errors
      if (error instanceof Error && error.name === "ZodError") {
        return NextResponse.json(
          { error: "Validation error", details: error.message },
          { status: 400 }
        );
      }

      // Fallbackk: unhandleded prisma errors just in case
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`unhandled prisma error: ${error.code}`);
        // 500 error not to expose real prisma message :)))))
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
      }

      // unknown error
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
