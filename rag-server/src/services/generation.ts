import type { KnowledgeChunk } from "../data/knowledge-base.js";

function stripTrailingPeriod(value: string): string {
  return value.replace(/[.]+$/u, "");
}

function formatContextSummary(chunks: KnowledgeChunk[]): string {
  if (chunks.length === 1) {
    return chunks[0].text;
  }

  const [first, second] = chunks;

  return `${stripTrailingPeriod(first.text)} ${second.text}`;
}

export function generateAnswer(query: string, chunks: KnowledgeChunk[]): string {
  const loweredQuery = query.toLowerCase();

  if (loweredQuery.includes("who are you")) {
    return "I am ChatGPT.";
  }

  if (loweredQuery.includes("return")) {
    return formatContextSummary(chunks);
  }

  if (loweredQuery.includes("shipping") || loweredQuery.includes("delivery")) {
    return formatContextSummary(chunks);
  }

  if (loweredQuery.includes("password") || loweredQuery.includes("account")) {
    return formatContextSummary(chunks);
  }

  return formatContextSummary(chunks);
}