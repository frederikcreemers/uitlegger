import { action } from "./_generated/server";
import { v } from "convex/values";

export const explain = action({
  args: {
    query: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args) => {},
});
