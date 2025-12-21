import { action, internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { cleanText, slugify } from "./utils/text";
import { Doc } from "./_generated/dataModel";
import { dutchExplanationPrompt } from "./ai/prompts";
import { getPromptResponse } from "./ai/agents";

export const explain = action({
  args: {
    query: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"explanations">> => {
    const query = cleanText(args.query);
    const slug = slugify(query);
    const existingExplanation: Doc<"explanations"> | null = await ctx.runQuery(
      internal.queries.getExplanation,
      { slug }
    );

    if (existingExplanation) {
      return existingExplanation;
    }

    const explanation: Omit<Doc<"explanations">, "_id" | "_creationTime"> = {
      slug,
      title: query,
      explanation: "",
      exampleSentences: [],
      status: "generating",
    };

    const id = await ctx.runMutation(
      internal.mutations.createExplanation,
      explanation
    );

    await ctx.scheduler.runAfter(0, internal.explanation.generateExplanation, {
      explanationId: id,
      query: query,
    });

    return {
      _id: id,
      _creationTime: Date.now(),
      ...explanation,
    } as Doc<"explanations">;
  },
});

export const generateExplanation = internalAction({
  args: {
    query: v.string(),
    explanationId: v.id("explanations"),
  },
  handler: async (ctx, args): Promise<void> => {
    const prompt = dutchExplanationPrompt(args.query);
    const response = await getPromptResponse(prompt);
    let sequence = 0;
    let result = "";
    for await (const chunk of response) {
      if (!chunk.choices[0].delta.content) {
        continue;
      }

      result += chunk.choices[0].delta.content!;

      await ctx.runMutation(internal.mutations.createExplanationChunk, {
        explanationId: args.explanationId,
        chunk: chunk.choices[0].delta.content!,
        sequence: sequence++,
      });
    }

    await ctx.runMutation(internal.mutations.finishExplanation, {
      explanationId: args.explanationId,
      explanation: result,
    });

    return;
  },
});
