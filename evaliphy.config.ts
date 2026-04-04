import { defineConfig } from 'evaliphy';

export default defineConfig({
  http: {
    baseUrl: "http://localhost:8000",
    timeout: 10000,
    headers: {
      "X-API-Key": "my-secret-test-key"
    }
  },
  evalDir: './evals',
  llmAsJudgeConfig: {
    model: 'gpt-4o-mini',
    provider: {
      type: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
    },
    temperature: 0,
  },
});
