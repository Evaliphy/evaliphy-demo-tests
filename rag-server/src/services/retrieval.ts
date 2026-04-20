import type { KnowledgeChunk } from "../data/knowledge-base.js";

export interface RetrievalResult {
  chunks: KnowledgeChunk[];
  topScore: number;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function scoreChunk(query: string, chunk: KnowledgeChunk): number {
  const queryTokens = new Set(tokenize(query));
  const chunkTokens = new Set(tokenize(chunk.text));

  let score = 0;

  for (const token of queryTokens) {
    if (chunkTokens.has(token)) {
      score += 2;
    }
  }

  const loweredQuery = query.toLowerCase();

  for (const keyword of chunk.keywords) {
    if (loweredQuery.includes(keyword.toLowerCase())) {
      score += 3;
    }
  }

  if (loweredQuery.includes(chunk.domain.toLowerCase().replace(/-/g, " "))) {
    score += 2;
  }

  return score;
}

export function retrieveRelevantChunks(
  query: string,
  knowledgeBase: KnowledgeChunk[],
  topK = 3,
): RetrievalResult {
  const ranked = knowledgeBase
    .map((chunk) => ({ chunk, score: scoreChunk(query, chunk) }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);

  return {
    chunks: ranked.slice(0, topK).map((entry) => entry.chunk),
    topScore: ranked[0]?.score ?? 0,
  };
}