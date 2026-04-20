import type { Response } from "express";
import { Router } from "express";
import { z } from "zod";

import { validateRequest } from "../middleware/validation.js";
import type { ChatRefusalResponse, ChatResponder, ChatSuccessResponse } from "../types/chat.js";

const STREAM_DELAY_MS = 40;
const STREAM_WORDS_PER_CHUNK = 5;

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function chunkText(text: string): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += STREAM_WORDS_PER_CHUNK) {
    const chunkWords = words.slice(index, index + STREAM_WORDS_PER_CHUNK);
    const chunk = chunkWords.join(" ");
    const isLastChunk = index + STREAM_WORDS_PER_CHUNK >= words.length;
    chunks.push(isLastChunk ? chunk : `${chunk} `);
  }

  return chunks;
}

async function writeStream(
  response: Response,
  payload: ChatSuccessResponse | ChatRefusalResponse,
): Promise<void> {
  let closed = false;
  const answerText = payload.answer ?? payload.message;

  response.status(200);
  response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.setHeader("X-Accel-Buffering", "no");
  response.flushHeaders();

  response.on("close", () => {
    closed = true;
  });

  for (const chunk of chunkText(answerText)) {
    if (closed) {
      return;
    }

    response.write(`data: ${JSON.stringify({ token: chunk })}\n\n`);
    await delay(STREAM_DELAY_MS);
  }

  if (closed) {
    return;
  }

  response.write(`data: ${JSON.stringify({ done: true, ...payload })}\n\n`);
  response.end();
}

const chatBodySchema = z.object({
  history: z.array(z.unknown()).optional(),
  message: z.string().trim().min(1),
  sessionId: z.string().trim().min(1).optional(),
});

const chatQuerySchema = z.object({
  simulate: z
    .enum(["hallucination", "slow", "empty-context", "partial", "error", "truncated"])
    .optional(),
  stream: z.enum(["true", "false"]).optional(),
});

export function createChatRouter(chatService: ChatResponder): Router {
  const router = Router();

  router.post(
    "/chat",
    validateRequest({ body: chatBodySchema, query: chatQuerySchema }),
    async (request, response, next) => {
      try {
        const result = chatService.respond({
          ...request.body,
          simulate: request.query.simulate,
          stream: false,
        });

        if (request.query.stream === "true") {
          await writeStream(response, result);
          return;
        }

        response.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}