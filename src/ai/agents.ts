import { OpenRouter } from "@openrouter/sdk";
import type { JSONSchemaConfig } from "@openrouter/sdk/models";

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

export function getStructuredPromptResponse(
  prompt: string,
  schema: JSONSchemaConfig
) {
  return openRouter.chat.send({
    model: "google/gemini-3-flash-preview",
    responseFormat: { type: "json_schema", jsonSchema: schema },
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

export async function getStringArrayResponse(prompt: string) {
  const schema: JSONSchemaConfig = {
    name: "string_array",
    strict: true,
    schema: {
      type: "array",
      items: {
        type: "string",
      },
    },
  };

  const resp = await getStructuredPromptResponse(prompt, schema);

  const json = JSON.parse(resp.choices[0].message.content as string);
  if (!Array.isArray(json)) {
    throw new Error("Response is not an array");
  }
  if (json.some((item: string) => typeof item !== "string")) {
    throw new Error("Response is not an array of strings");
  }
  return json as string[];
}
