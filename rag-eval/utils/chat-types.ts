export interface ChatSuccessResponse {
  answer: string;
  context: string[];
  meta: {
    latencyMs: number;
    model: string;
    retrievedChunks: number;
  };
  sessionId: string;
}

export interface ChatRefusalResponse {
  answer: null;
  context: string[];
  message: string;
  meta: {
    latencyMs: number;
    model: string;
    retrievedChunks: number;
  };
  reason: "out_of_scope" | "topic_not_supported";
  refused: true;
  sessionId: string;
}

export type ChatResponse = ChatSuccessResponse | ChatRefusalResponse;

