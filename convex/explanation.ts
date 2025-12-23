import { action, internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import { cleanText, slugify } from "./utils/text";
import { Doc } from "./_generated/dataModel";
import { dutchExplanationPrompt, translationPrompt } from "./ai/prompts";
import { getPromptResponse } from "./ai/agents";
import { ActionCtx } from "./_generated/server";

export const explain = action({
  args: {
    query: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"explanations">> => {
    const query = cleanText(args.query);
    const slug = slugify(query);
    const existingExplanation: Doc<"explanations"> | null = await ctx.runQuery(
      internal.queries.getExplanation,
      { slug }
    );

    if (existingExplanation) {
      const existingTranslation = await ctx.runQuery(
        internal.queries.getTranslation,
        {
          explanationId: existingExplanation._id,
          languageCode: args.languageCode,
        }
      );
      if (!existingTranslation) {
        await makeTranslation(ctx, existingExplanation, args.languageCode);
      }
      return existingExplanation;
    }

    const explanation: Omit<Doc<"explanations">, "_id" | "_creationTime"> = {
      slug,
      title: query,
      explanation: "",
      exampleSentences: [],
      status: "generating",
    };

    const id = await ctx.runMutation(
      internal.mutations.createExplanation,
      explanation
    );

    await ctx.scheduler.runAfter(0, internal.explanation.generateExplanation, {
      explanationId: id,
      query: query,
    });

    const explanationDoc = {
      _id: id,
      _creationTime: Date.now(),
      ...explanation,
    } as Doc<"explanations">;

    await makeTranslation(ctx, explanationDoc, args.languageCode);

    return explanationDoc;
  },
});

export const generateExplanation = internalAction({
  args: {
    query: v.string(),
    explanationId: v.id("explanations"),
  },
  handler: async (ctx, args): Promise<void> => {
    const prompt = dutchExplanationPrompt(args.query);
    const response = await getPromptResponse(prompt);
    let sequence = 0;
    let result = "";
    for await (const chunk of response) {
      if (!chunk.choices[0].delta.content) {
        continue;
      }

      result += chunk.choices[0].delta.content!;

      await ctx.runMutation(internal.mutations.createExplanationChunk, {
        explanationId: args.explanationId,
        chunk: chunk.choices[0].delta.content!,
        sequence: sequence++,
      });
    }

    await ctx.runMutation(internal.mutations.finishExplanation, {
      explanationId: args.explanationId,
      explanation: result,
    });

    return;
  },
});

export const addMissingTranslation = action({
  args: {
    slug: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const explanation = await ctx.runQuery(internal.queries.getExplanation, {
      slug: args.slug,
    });

    if (!explanation) {
      throw new ConvexError("Explanation not found");
    }

    const existingTranslation = await ctx.runQuery(
      internal.queries.getTranslation,
      {
        explanationId: explanation._id,
        languageCode: args.languageCode,
      }
    );

    if (existingTranslation) {
      return;
    }

    await makeTranslation(ctx, explanation, args.languageCode);
  },
});

async function makeTranslation(
  ctx: ActionCtx,
  explanation: Doc<"explanations">,
  languageCode: string
): Promise<void> {
  const translationId = await ctx.runMutation(
    internal.mutations.createTranslation,
    {
      explanationId: explanation._id,
      languageCode: languageCode,
      explanation: "",
      exampleSentences: [],
      status: "generating",
    }
  );

  await ctx.scheduler.runAfter(0, internal.explanation.generateTranslation, {
    translationId: translationId,
    explanationTitle: explanation.title,
    languageCode: languageCode,
  });
  return;
}

export const generateTranslation = internalAction({
  args: {
    translationId: v.id("translations"),
    explanationTitle: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const prompt = translationPrompt(args.explanationTitle, args.languageCode);
    const response = await getPromptResponse(prompt);
    let sequence = 0;
    let result = "";
    for await (const chunk of response) {
      if (!chunk.choices[0].delta.content) {
        continue;
      }

      result += chunk.choices[0].delta.content!;

      await ctx.runMutation(internal.mutations.createTranslationChunk, {
        translationId: args.translationId,
        chunk: chunk.choices[0].delta.content!,
        sequence: sequence++,
      });
    }

    await ctx.runMutation(internal.mutations.finishTranslation, {
      translationId: args.translationId,
      explanation: result,
    });

    return;
  },
});
