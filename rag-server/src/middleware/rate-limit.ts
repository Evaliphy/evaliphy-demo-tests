import rateLimit from "express-rate-limit";

import type { AppConfig } from "../config/env.js";

export function createRateLimiter(config: AppConfig) {
  return rateLimit({
    legacyHeaders: false,
    limit: config.rateLimitMax,
    standardHeaders: true,
    windowMs: config.rateLimitWindowMs,
    message: {
      error: "rate_limited",
      message: "Too many requests. Please retry later.",
    },
  });
}