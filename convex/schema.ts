import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  explanations: defineTable({
    slug: v.string(),
    title: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
    status: v.union(v.literal("generating"), v.literal("complete")),
  }).index("by_slug", ["slug"]),

  translations: defineTable({
    explanationId: v.id("explanations"),
    languageCode: v.string(),
    explanation: v.string(),
    exampleSentences: v.array(v.string()),
    status: v.union(v.literal("generating"), v.literal("complete")),
  }).index("by_explanation_language", ["explanationId", "languageCode"]),

  explanationChunks: defineTable({
    explanationId: v.id("explanations"),
    chunk: v.string(),
    sequence: v.number(),
  }).index("by_explanation_sequence", ["explanationId", "sequence"]),

  translationChunks: defineTable({
    translationId: v.id("translations"),
    chunk: v.string(),
    sequence: v.number(),
  }).index("by_translation_sequence", ["translationId", "sequence"]),

  conversations: defineTable({
    languageCode: v.string(),
    lastActivityAt: v.number(),
  }).index("by_last_activity", ["lastActivityAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    dutchContent: v.string(),
    translatedContent: v.string(),
    status: v.union(
      v.literal("complete"),
      v.literal("generating_dutch"),
      v.literal("generating_translation"),
    ),
  }).index("by_conversation", ["conversationId"]),

  messageDutchChunks: defineTable({
    messageId: v.id("messages"),
    chunk: v.string(),
    sequence: v.number(),
  }).index("by_message_sequence", ["messageId", "sequence"]),

  messageTranslatedChunks: defineTable({
    messageId: v.id("messages"),
    chunk: v.string(),
    sequence: v.number(),
  }).index("by_message_sequence", ["messageId", "sequence"]),
});
