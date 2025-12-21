import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

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
