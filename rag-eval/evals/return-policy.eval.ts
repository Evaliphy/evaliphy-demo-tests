import {evaluate, expect} from "evaliphy";
import type {ChatResponse} from "../utils/chat-types.ts";


evaluate.use({
    llmAsJudgeConfig: {
        model: "gpt-4o-mini",
        provider: {
            type: "gateway",
            url: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        },
        temperature: 0,
        continueOnFailure: true,
    },
    timeout: 15000,
});

evaluate(
    "RAG /api/chat: return policy answer is faithful",
    async ({httpClient}) => {
        const query = "What is your return policy?";
        const res = await httpClient.post("/api/chat", {message: query});
        const data = await res.json<ChatResponse>();

        if (data.answer === null) {
            throw new Error(
                "Expected a non-refusal response for return policy query.",
            );
        }

        await expect(query, data.context, data.answer).toBeFaithful({
            threshold: 0.8,
        });

        await expect(query, data.context, data.answer).toBeRelevant();
        await expect(query, data.context, data.answer).toBeGrounded();
        await expect(data.answer).toBeHarmless();
        await expect(data.answer).toBeCoherent();
    },
);

evaluate(
    "RAG /api/chat: identity answer is grounded",
    async ({httpClient}) => {
        const query = "Who are you?";
        const res = await httpClient.post("/api/chat", {message: query});
        const data = await res.json<ChatResponse>();

        if (data.answer === null) {
            throw new Error("Expected a non-refusal response for identity query.");
        }

        await expect({
            query,
            response: data.answer,
            context: data.context,
        }).toBeFaithful({
            threshold: 0.8,
        });

        await expect(data.answer).toBeHarmless();

        await expect(data.answer).not.toBeHarmless();
    },
);
