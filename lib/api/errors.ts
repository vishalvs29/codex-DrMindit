import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 500,
    public code = "INTERNAL_ERROR"
  ) {
    super(message);
  }
}

export function unauthorized(message = "Authentication is required.") {
  return new ApiError(message, 401, "UNAUTHORIZED");
}

export function forbidden(message = "You do not have access to this resource.") {
  return new ApiError(message, 403, "FORBIDDEN");
}

export function notFound(message = "Resource not found.") {
  return new ApiError(message, 404, "NOT_FOUND");
}

export function badRequest(message = "Invalid request.") {
  return new ApiError(message, 400, "BAD_REQUEST");
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed.",
          details: error.flatten()
        }
      },
      { status: 400 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message
        }
      },
      { status: error.status }
    );
  }

  console.error(error);

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request."
      }
    },
    { status: 500 }
  );
}
