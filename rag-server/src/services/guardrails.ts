const BLOCKED_TOPIC_RULES = [
  {
    keywords: ["religion", "best religion", "faith", "church"],
    reason: "topic_not_supported" as const,
  },
  {
    keywords: ["vote", "politics", "election", "president", "government"],
    reason: "topic_not_supported" as const,
  },
  {
    keywords: ["medical", "medication", "diagnosis", "treatment", "symptom"],
    reason: "topic_not_supported" as const,
  },
  {
    keywords: ["legal", "lawyer", "contract", "lawsuit", "legally binding"],
    reason: "topic_not_supported" as const,
  },
  {
    keywords: ["hurt someone", "harm", "weapon", "kill", "attack"],
    reason: "topic_not_supported" as const,
  },
];

export interface GuardrailDecision {
  message: string;
  reason: "out_of_scope" | "topic_not_supported";
  refused: boolean;
}

const REFUSAL_MESSAGE =
  "I can only assist with questions related to our products and services.";

export function evaluateGuardrails(query: string, topRetrievalScore: number): GuardrailDecision {
  const loweredQuery = query.toLowerCase();

  for (const rule of BLOCKED_TOPIC_RULES) {
    if (rule.keywords.some((keyword) => loweredQuery.includes(keyword))) {
      return {
        refused: true,
        reason: rule.reason,
        message: REFUSAL_MESSAGE,
      };
    }
  }

  if (topRetrievalScore < 3) {
    return {
      refused: true,
      reason: "out_of_scope",
      message: REFUSAL_MESSAGE,
    };
  }

  return {
    refused: false,
    reason: "out_of_scope",
    message: REFUSAL_MESSAGE,
  };
}