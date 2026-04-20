# Evaliphy RAG Demo

This project demonstrates how to evaluate a RAG-style chat API using Evaliphy.

## Core idea

- `rag-server/` acts like an LLM-backed RAG endpoint.
- `rag-eval/` calls that endpoint through HTTP and scores responses with Evaliphy.
- Evaliphy treats the server as a black-box LLM interaction surface (`POST /api/chat`).

## Project flow

1. Start `rag-server` (the system under test).
2. Run `rag-eval` tests (the evaluator).
3. Evaliphy sends test queries to `rag-server` and runs quality checks such as faithfulness/relevance.

## Test data and scenarios

- Golden dataset: `rag-eval/golden-data.csv`
- Eval scenarios: `rag-eval/evals/return-policy.eval.ts`
- RAG knowledge source used by server: `rag-server/src/data/knowledge-base.ts`

## Run locally

### 1) Start rag-server

```bash
cd rag-server
npm install
npm run dev
```

Server runs on `http://localhost:3000`.

### 2) Run evals

Open another terminal:

```bash
cd rag-eval
npm install
export OPENROUTER_API_KEY=sk-or-...
npx evaliphy eval
```

This executes Evaliphy against the local `rag-server` endpoint.

## Run with Docker Compose

From project root:

```bash
docker compose up --build rag-server
```

Then run evals from `rag-eval/` as above.

## Running against local Evaliphy Build

This repo is used by Evaliphy developers to validate end-to-end behaviour against a local build of the SDK before publishing to npm.

### 1) Pack the local Evaliphy SDK

From your local Evaliphy source repo:

```bash
cd /path/to/evaliphy
pnpm install & pnpm build
npm pack             # produces evaliphy-<version> tgz in the current directory
```

Copy (or note the path to) the generated tarball, e.g. `evaliphy-1.0.1-beta.10.tgz`.

### 2) Point rag-eval at the local tarball

In `rag-eval/package.json`, replace the registry dependency with a `file:` reference:

```json
"dependencies": {
  "evaliphy": "file:evaliphy-1.0.1-beta.10.tgz"
}
```

Adjust the relative path so it points to wherever the `.tgz` was produced.

### 3) Reinstall and run evals

```bash
cd rag-eval
npm install          # installs from the local tarball
npm run test         # runs evals against rag-server
```

> **Tip:** Repeat steps 1 → 3 after every SDK change. Because `npm install` caches tarballs, run `npm install --prefer-dedupe` or delete `node_modules/evaliphy` first if you do not see your changes picked up.

## Notes

- If eval import fails, verify utility imports in eval files resolve correctly.
- If judge assertions fail with authentication errors, confirm `OPENROUTER_API_KEY` is set.