import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";
import type { Logger } from "pino";

export function createRequestLogger(logger: Logger) {
  return (request: Request, response: Response, next: NextFunction) => {
    const startedAt = Date.now();
    const requestId = randomUUID();

    response.locals.requestId = requestId;
    response.setHeader("x-request-id", requestId);

    logger.info(
      {
        method: request.method,
        path: request.originalUrl,
        requestId,
      },
      "request started",
    );

    response.on("finish", () => {
      logger.info(
        {
          durationMs: Date.now() - startedAt,
          method: request.method,
          path: request.originalUrl,
          requestId,
          statusCode: response.statusCode,
        },
        "request completed",
      );
    });

    next();
  };
}