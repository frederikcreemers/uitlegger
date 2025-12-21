import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createExplanation = internalMutation({
  args: {
    slug: v.string(),
    title: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
    status: v.union(v.literal("generating"), v.literal("complete")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("explanation", args);
  },
});

export const createTranslation = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    languageCode: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
    createdAt: v.number(),
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
    createdAt: v.number(),
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
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("translationTokens", args);
  },
});
