import { Router } from "express";
import { z } from "zod";

import { validateRequest } from "../middleware/validation.js";
import type { SessionReader } from "../types/chat.js";

const sessionParamsSchema = z.object({
  sessionId: z.string().trim().min(1),
});

export function createSessionRouter(sessionStore: SessionReader): Router {
  const router = Router();

  router.get(
    "/session/:sessionId",
    validateRequest({ params: sessionParamsSchema }),
    (request, response) => {
      response.json({
        sessionId: request.params.sessionId,
        turns: sessionStore.getSession(request.params.sessionId),
      });
    },
  );

  return router;
}