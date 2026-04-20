import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import type { AppConfig } from "../config/env.js";
import { createAppError } from "../errors/app-error.js";

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

function isAuthorizedToken(token: string, config: AppConfig): boolean {
  if (token === config.demoBearerToken) {
    return true;
  }

  try {
    jwt.verify(token, config.demoJwtSecret);
    return true;
  } catch {
    return false;
  }
}

export function createAuthMiddleware(config: AppConfig) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const token = extractBearerToken(request.header("authorization"));

    if (!token || !isAuthorizedToken(token, config)) {
      next(
        createAppError(
          401,
          "unauthorized",
          "Missing or invalid authorization token.",
        ),
      );
      return;
    }

    next();
  };
}