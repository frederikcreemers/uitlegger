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
    status: v.union(v.literal("generating"), v.literal("complete")),
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
        q.eq("explanationId", args.explanationId),
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});

export const finishTranslation = internalMutation({
  args: {
    translationId: v.id("translations"),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.translationId, {
      explanation: args.explanation,
      status: "complete",
    });

    const chunks = await ctx.db
      .query("translationChunks")
      .withIndex("by_translation_sequence", (q) =>
        q.eq("translationId", args.translationId),
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});

export const addExampleSentences = internalMutation({
  args: {
    explanationId: v.id("explanations"),
    exampleSentences: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.explanationId, {
      exampleSentences: args.exampleSentences,
    });
  },
});

export const addTranslatedExampleSentences = internalMutation({
  args: {
    translationId: v.id("translations"),
    exampleSentences: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.translationId, {
      exampleSentences: args.exampleSentences,
    });
  },
});

export const createConversation = internalMutation({
  args: {
    languageCode: v.string(),
    lastActivityAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", args);
  },
});

export const createMessage = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    dutchContent: v.string(),
    translatedContent: v.string(),
    status: v.union(
      v.literal("complete"),
      v.literal("generating_dutch"),
      v.literal("generating_translation"),
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", args);
  },
});

export const createMessageDutchChunk = internalMutation({
  args: {
    messageId: v.id("messages"),
    chunk: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messageDutchChunks", args);
  },
});

export const createMessageTranslatedChunk = internalMutation({
  args: {
    messageId: v.id("messages"),
    chunk: v.string(),
    sequence: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messageTranslatedChunks", args);
  },
});

export const finishMessageDutch = internalMutation({
  args: {
    messageId: v.id("messages"),
    dutchContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      dutchContent: args.dutchContent,
      status: "generating_translation",
    });

    const chunks = await ctx.db
      .query("messageDutchChunks")
      .withIndex("by_message_sequence", (q) =>
        q.eq("messageId", args.messageId),
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});

export const finishMessageTranslated = internalMutation({
  args: {
    messageId: v.id("messages"),
    translatedContent: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      translatedContent: args.translatedContent,
      status: "complete",
    });

    const chunks = await ctx.db
      .query("messageTranslatedChunks")
      .withIndex("by_message_sequence", (q) =>
        q.eq("messageId", args.messageId),
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }
  },
});

export const updateConversationActivity = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    lastActivityAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      lastActivityAt: args.lastActivityAt,
    });
  },
});

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const deleteStaleConversations = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const stale = await ctx.db
      .query("conversations")
      .withIndex("by_last_activity", (q) => q.lt("lastActivityAt", cutoff))
      .collect();

    for (const conv of stale) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
        .collect();

      for (const msg of messages) {
        const dutchChunks = await ctx.db
          .query("messageDutchChunks")
          .withIndex("by_message_sequence", (q) => q.eq("messageId", msg._id))
          .collect();
        for (const c of dutchChunks) await ctx.db.delete(c._id);

        const translatedChunks = await ctx.db
          .query("messageTranslatedChunks")
          .withIndex("by_message_sequence", (q) => q.eq("messageId", msg._id))
          .collect();
        for (const c of translatedChunks) await ctx.db.delete(c._id);

        await ctx.db.delete(msg._id);
      }

      await ctx.db.delete(conv._id);
    }
  },
});
