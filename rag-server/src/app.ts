import express from "express";
import pino from "pino";

import type { AppConfig } from "./config/env.js";
import { KNOWLEDGE_BASE } from "./data/knowledge-base.js";
import { createAppError, createErrorHandler } from "./errors/app-error.js";
import { createAuthMiddleware } from "./middleware/auth.js";
import { createRateLimiter } from "./middleware/rate-limit.js";
import { createRequestLogger } from "./middleware/request-logger.js";
import { createChatRouter } from "./routes/chat.js";
import { createHealthRouter } from "./routes/health.js";
import { createSessionRouter } from "./routes/session.js";
import { ChatService } from "./services/chat-service.js";
import { SessionStore } from "./services/session-store.js";

export function createApp(config: AppConfig) {
  const app = express();
  const logger = pino({ level: config.logLevel });
  const sessionStore = new SessionStore(config.sessionTtlMs, config.sessionMaxTurns);
  const chatService = new ChatService(KNOWLEDGE_BASE, sessionStore);

  app.disable("x-powered-by");
  app.use(createRequestLogger(logger));
  app.use(express.json());
  app.use("/api", createHealthRouter(config));
  app.use("/api", createRateLimiter(config));
  app.use("/api", createAuthMiddleware(config));
  app.use("/api", createChatRouter(chatService));
  app.use("/api", createSessionRouter(sessionStore));

  app.use((_request, response) => {
    throw createAppError(404, "not_found", "Route not found.");
  });

  app.use(createErrorHandler(logger));

  return app;
}