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

export const getTranslation = internalQuery({
  args: {
    explanationId: v.id("explanations"),
    languageCode: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("translations")
      .withIndex("by_explanation_language", (q) =>
        q
          .eq("explanationId", args.explanationId)
          .eq("languageCode", args.languageCode)
      )
      .first();
  },
});

export const getTranslationPublic = query({
  args: {
    slug: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args) => {
    const explanation = await ctx.db
      .query("explanations")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!explanation) {
      return null;
    }

    return await ctx.db
      .query("translations")
      .withIndex("by_explanation_language", (q) =>
        q
          .eq("explanationId", explanation._id)
          .eq("languageCode", args.languageCode)
      )
      .first();
  },
});

export const getPendingTranslation = query({
  args: {
    translationId: v.id("translations"),
  },
  handler: async (ctx, args) => {
    const chunks = await ctx.db
      .query("translationChunks")
      .withIndex("by_translation_sequence", (q) =>
        q.eq("translationId", args.translationId)
      )
      .collect();

    return {
      text: chunks.map((chunk) => chunk.chunk).join(""),
    };
  },
});
