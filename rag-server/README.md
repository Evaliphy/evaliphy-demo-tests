# RAG Server

This is a small demo RAG server used by the Evaliphy tests in this workspace.

## Install and Run

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000` by default.

For a production-style start:

```bash
npm run build
npm start
```

## Authentication

All endpoints except `GET /api/health` require a Bearer token.

Default demo token:

```text
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo
```

## Endpoints

### Health check

```bash
curl http://localhost:3000/api/health
```

### Chat

```bash
curl -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo' \
  -d '{"message":"Who are you?"}'
```

Streaming response:

```bash
curl -N -X POST 'http://localhost:3000/api/chat?stream=true' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo' \
  -d '{"message":"Tell me about your return policy."}'
```

Request body:

```json
{
  "message": "Who are you?",
  "sessionId": "optional-session-id",
  "history": []
}
```

### Session history

```bash
curl http://localhost:3000/api/session/<sessionId> \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo'
```

## Environment Variables

- `PORT`: server port, default `3000`
- `LOG_LEVEL`: `debug`, `info`, `warn`, or `error`
- `DEMO_BEARER_TOKEN`: overrides the default demo Bearer token
- `DEMO_JWT_SECRET`: JWT secret for validating non-demo Bearer tokens
- `RATE_LIMIT_MAX`: requests allowed per window, default `100`
- `RATE_LIMIT_WINDOW_MS`: rate-limit window in milliseconds, default `60000`
- `SESSION_MAX_TURNS`: max stored turns per session, default `100`
- `SESSION_TTL_MS`: session inactivity TTL in milliseconds, default `1800000`

## Current Limitations

- `simulate=hallucination|slow|empty-context|partial|error|truncated` is not implemented yet.