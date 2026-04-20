export interface ChatRequestInput {
  history?: unknown[];
  message: string;
  sessionId?: string;
  simulate?: string;
  stream?: boolean;
}

export interface ChatMeta {
  latencyMs: number;
  model: string;
  retrievedChunks: number;
}

export interface ChatSuccessResponse {
  answer: string;
  context: string[];
  meta: ChatMeta;
  sessionId: string;
}

export interface ChatRefusalResponse {
  answer: null;
  context: string[];
  message: string;
  meta: ChatMeta;
  reason: "out_of_scope" | "topic_not_supported";
  refused: true;
  sessionId: string;
}

export type ChatResponse = ChatSuccessResponse | ChatRefusalResponse;

export interface SessionTurn {
  answer: string | null;
  query: string;
  timestamp: string;
}

export interface ChatResponder {
  respond(input: ChatRequestInput): ChatResponse;
}

export interface SessionReader {
  getSession(sessionId: string): SessionTurn[];
}