import OpenAI from "openai";

export function getAIClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY is required to make AI requests.");
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
  });
}
