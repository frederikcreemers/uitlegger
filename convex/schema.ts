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
  }).index("by_explanation_language", ["explanationId", "languageCode"]),

  explanationTokens: defineTable({
    explanationId: v.id("explanations"),
    token: v.string(),
    sequence: v.number(),
  }).index("by_explanation_sequence", ["explanationId", "sequence"]),

  translationTokens: defineTable({
    translationId: v.id("translations"),
    token: v.string(),
    sequence: v.number(),
  }).index("by_translation_sequence", ["translationId", "sequence"]),
});
