import { OpenRouter } from "@openrouter/sdk";

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function getPromptResponse(prompt: string) {
  return openRouter.chat.send({
    model: "google/gemini-3-flash-preview",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  });
}
