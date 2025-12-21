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

export const createExplanationToken = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    token: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("explanationTokens", args);
  },
});

export const createTranslationToken = internalMutation({
  args: {
    translationId: v.id("translations"),
    token: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("translationTokens", args);
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
  },
});
