import { Router } from "express";

import type { AppConfig } from "../config/env.js";

export function createHealthRouter(config: AppConfig): Router {
  const router = Router();

  router.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      version: config.appVersion,
      uptime: Math.floor(process.uptime()),
    });
  });

  return router;
}