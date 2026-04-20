import type { NextFunction, Request, Response } from "express";
import type { Logger } from "pino";
import { ZodError } from "zod";

export interface AppErrorShape {
  code: string;
  details?: unknown;
  expose?: boolean;
  message: string;
  statusCode: number;
}

export class AppError extends Error {
  code: string;
  details?: unknown;
  expose: boolean;
  statusCode: number;

  constructor({
    code,
    details,
    expose = true,
    message,
    statusCode,
  }: AppErrorShape) {
    super(message);
    this.code = code;
    this.details = details;
    this.expose = expose;
    this.statusCode = statusCode;
  }
}

export function createAppError(
  statusCode: number,
  code: string,
  message: string,
  details?: unknown,
  expose = true,
): AppError {
  return new AppError({ code, details, expose, message, statusCode });
}

function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return createAppError(
      400,
      "validation_error",
      "Request validation failed.",
      error.flatten(),
    );
  }

  return createAppError(500, "internal_error", "Internal server error.", undefined, false);
}

export function createErrorHandler(logger: Logger) {
  return (error: unknown, request: Request, response: Response, _next: NextFunction) => {
    const appError = normalizeError(error);
    const requestId = response.locals.requestId as string | undefined;

    if (appError.statusCode >= 500) {
      logger.error(
        {
          err: error,
          method: request.method,
          path: request.originalUrl,
          requestId,
        },
        "request failed",
      );
    }

    response.status(appError.statusCode).json({
      error: appError.code,
      message: appError.message,
      ...(appError.details ? { details: appError.details } : {}),
      ...(requestId ? { requestId } : {}),
    });
  };
}