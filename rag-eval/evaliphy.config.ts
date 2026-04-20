import { defineConfig } from 'evaliphy';

export default defineConfig({
  http: {
    baseUrl: "http://localhost:3000",
    timeout: 10000,
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo"
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
