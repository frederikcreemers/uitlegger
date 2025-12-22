import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createExplanation = internalMutation({
  args: {
    slug: v.string(),
    title: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
    status: v.union(v.literal("generating"), v.literal("complete")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("explanations", args);
  },
});

export const createTranslation = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    languageCode: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("translations", args);
  },
});

export const createExplanationChunk = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    chunk: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("explanationChunks", args);
  },
});

export const createTranslationChunk = internalMutation({
  args: {
    translationId: v.id("translations"),
    chunk: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("translationChunks", args);
  },
});

export const finishExplanation = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.explanationId, {
      explanation: args.explanation,
      status: "complete",
    });

    const chunks = await ctx.db
      .query("explanationChunks")
      .withIndex("by_explanation_sequence", (q) =>
        q.eq("explanationId", args.explanationId)
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});
