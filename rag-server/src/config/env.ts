import dotenv from "dotenv";

dotenv.config();

const DEFAULT_APP_VERSION = "1.0.0";
const DEFAULT_BEARER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo";
const DEFAULT_JWT_SECRET = "demo-secret";
const DEFAULT_LOG_LEVEL = "info";
const DEFAULT_PORT = 3000;
const DEFAULT_RATE_LIMIT_MAX = 100;
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60_000;
const DEFAULT_SESSION_MAX_TURNS = 100;
const DEFAULT_SESSION_TTL_MS = 30 * 60_000;

export type LogLevel = "debug" | "info" | "warn" | "error";

function parseInteger(
  value: string | undefined,
  fallback: number,
  fieldName: string,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  return parsed;
}

function parseLogLevel(value: string | undefined): LogLevel {
  if (!value) {
    return DEFAULT_LOG_LEVEL;
  }

  if (value === "debug" || value === "info" || value === "warn" || value === "error") {
    return value;
  }

  throw new Error("LOG_LEVEL must be one of: debug, info, warn, error.");
}

function parsePort(value: string | undefined): number {
  return parseInteger(value, DEFAULT_PORT, "PORT");
}

export interface AppConfig {
  appVersion: string;
  demoBearerToken: string;
  demoJwtSecret: string;
  logLevel: LogLevel;
  port: number;
  rateLimitMax: number;
  rateLimitWindowMs: number;
  sessionMaxTurns: number;
  sessionTtlMs: number;
}

export function loadConfig(): AppConfig {
  return {
    appVersion: process.env.APP_VERSION ?? DEFAULT_APP_VERSION,
    demoBearerToken: process.env.DEMO_BEARER_TOKEN ?? DEFAULT_BEARER_TOKEN,
    demoJwtSecret: process.env.DEMO_JWT_SECRET ?? DEFAULT_JWT_SECRET,
    logLevel: parseLogLevel(process.env.LOG_LEVEL),
    port: parsePort(process.env.PORT),
    rateLimitMax: parseInteger(
      process.env.RATE_LIMIT_MAX,
      DEFAULT_RATE_LIMIT_MAX,
      "RATE_LIMIT_MAX",
    ),
    rateLimitWindowMs: parseInteger(
      process.env.RATE_LIMIT_WINDOW_MS,
      DEFAULT_RATE_LIMIT_WINDOW_MS,
      "RATE_LIMIT_WINDOW_MS",
    ),
    sessionMaxTurns: parseInteger(
      process.env.SESSION_MAX_TURNS,
      DEFAULT_SESSION_MAX_TURNS,
      "SESSION_MAX_TURNS",
    ),
    sessionTtlMs: parseInteger(
      process.env.SESSION_TTL_MS,
      DEFAULT_SESSION_TTL_MS,
      "SESSION_TTL_MS",
    ),
  };
}