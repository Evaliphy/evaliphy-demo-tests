import type { KnowledgeChunk } from "../data/knowledge-base.js";
import { createAppError } from "../errors/app-error.js";
import type { ChatRequestInput, ChatResponse, SessionTurn } from "../types/chat.js";
import { generateAnswer } from "./generation.js";
import { evaluateGuardrails } from "./guardrails.js";
import { retrieveRelevantChunks } from "./retrieval.js";
import { SessionStore } from "./session-store.js";

const MODEL_NAME = "mock-gpt";

export class ChatService {
  private readonly knowledgeBase: KnowledgeChunk[];
  private readonly sessionStore: SessionStore;

  constructor(knowledgeBase: KnowledgeChunk[], sessionStore: SessionStore) {
    this.knowledgeBase = knowledgeBase;
    this.sessionStore = sessionStore;
  }

  respond(input: ChatRequestInput): ChatResponse {
    if (input.simulate) {
      throw createAppError(
        501,
        "not_implemented",
        "Simulation modes will be implemented in Phase 4.",
      );
    }

    const startedAt = Date.now();
    const sessionId = this.sessionStore.createSessionId(input.sessionId);
    const retrieval = retrieveRelevantChunks(input.message, this.knowledgeBase);
    const guardrailDecision = evaluateGuardrails(input.message, retrieval.topScore);

    if (guardrailDecision.refused) {
      this.sessionStore.appendTurn(sessionId, this.createSessionTurn(input.message, null));

      return {
        answer: null,
        refused: true,
        reason: guardrailDecision.reason,
        message: guardrailDecision.message,
        context: [],
        sessionId,
        meta: {
          retrievedChunks: 0,
          model: MODEL_NAME,
          latencyMs: Date.now() - startedAt,
        },
      };
    }

    const context = retrieval.chunks.map((chunk) => chunk.text);
    const answer = generateAnswer(input.message, retrieval.chunks);

    this.sessionStore.appendTurn(sessionId, this.createSessionTurn(input.message, answer));

    return {
      answer,
      context,
      sessionId,
      meta: {
        retrievedChunks: retrieval.chunks.length,
        model: MODEL_NAME,
        latencyMs: Date.now() - startedAt,
      },
    };
  }

  private createSessionTurn(query: string, answer: string | null): SessionTurn {
    return {
      query,
      answer,
      timestamp: new Date().toISOString(),
    };
  }
}