import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

interface ValidationSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validateRequest(schemas: ValidationSchemas) {
  return (request: Request, _response: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body);
      }

      if (schemas.params) {
        request.params = schemas.params.parse(request.params);
      }

      if (schemas.query) {
        request.query = schemas.query.parse(request.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}