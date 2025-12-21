import { v } from "convex/values";
import { internalQuery, query } from "./_generated/server";

export const getExplanation = internalQuery({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("explanations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getExplanationPublic = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("explanations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getPendingExplanation = query({
  args: {
    explanationId: v.id("explanations"),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("explanationChunks")
      .withIndex("by_explanation_sequence", (q) =>
        q.eq("explanationId", args.explanationId)
      )
      .collect();

    return {
      text: chunks.map((chunk) => chunk.chunk).join(""),
    };
  },
});
