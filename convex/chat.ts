import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { v } from "convex/values";
import {
  dutchChatPrompt,
  translateToLanguagePrompt,
  translateToDutchPrompt,
} from "../src/ai/prompts";
import { getPromptResponse } from "../src/ai/agents";

async function translateText(
  text: string,
  targetLanguageCode: string,
): Promise<string> {
  const prompt =
    targetLanguageCode === "nl"
      ? translateToDutchPrompt(text)
      : translateToLanguagePrompt(text, targetLanguageCode);
  const response = await getPromptResponse(prompt);
  let result = "";
  for await (const chunk of response) {
    if (chunk.choices[0]?.delta?.content) {
      result += chunk.choices[0].delta.content;
    }
  }
  return result.trim();
}

export const sendMessage = action({
  args: {
    conversationId: v.optional(v.id("conversations")),
    content: v.string(),
    contentIsDutch: v.boolean(),
    languageCode: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"conversations">> => {
    let conversationId = args.conversationId;

    if (conversationId === undefined) {
      conversationId = await ctx.runMutation(
        internal.mutations.createConversation,
        {
          languageCode: args.languageCode,
          lastActivityAt: Date.now(),
        },
      );
    } else {
      await ctx.runMutation(internal.mutations.updateConversationActivity, {
        conversationId,
        lastActivityAt: Date.now(),
      });
    }

    let dutchContent: string;
    let translatedContent: string;

    if (args.contentIsDutch) {
      dutchContent = args.content;
      translatedContent = await translateText(args.content, args.languageCode);
    } else {
      translatedContent = args.content;
      dutchContent = await translateText(args.content, "nl");
    }

    await ctx.runMutation(internal.mutations.createMessage, {
      conversationId,
      role: "user",
      dutchContent,
      translatedContent,
      status: "complete",
    });

    const assistantMessageId = await ctx.runMutation(
      internal.mutations.createMessage,
      {
        conversationId,
        role: "assistant",
        dutchContent: "",
        translatedContent: "",
        status: "generating_dutch",
      },
    );

    await ctx.scheduler.runAfter(0, internal.chat.streamDutchResponse, {
      conversationId,
      messageId: assistantMessageId,
      languageCode: args.languageCode,
    });

    return conversationId;
  },
});

export const streamDutchResponse = internalAction({
  args: {
    conversationId: v.id("conversations"),
    messageId: v.id("messages"),
    languageCode: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.runQuery(internal.queries.getMessagesInternal, {
      conversationId: args.conversationId,
    });

    const completed = messages.filter(
      (m: Doc<"messages">) => m.status === "complete",
    );
    const history = completed.slice(0, -1).map((m: Doc<"messages">) => ({
      role: m.role,
      content: m.dutchContent,
    }));
    const lastMessage = completed[completed.length - 1];
    const newMessage =
      lastMessage?.role === "user" ? lastMessage.dutchContent : "";

    const prompt = dutchChatPrompt(history, newMessage);
    const response = await getPromptResponse(prompt);
    let sequence = 0;
    let result = "";

    for await (const chunk of response) {
      if (!chunk.choices[0]?.delta?.content) continue;
      result += chunk.choices[0].delta.content;
      await ctx.runMutation(internal.mutations.createMessageDutchChunk, {
        messageId: args.messageId,
        chunk: chunk.choices[0].delta.content,
        sequence: sequence++,
      });
    }

    await ctx.runMutation(internal.mutations.finishMessageDutch, {
      messageId: args.messageId,
      dutchContent: result,
    });

    await ctx.scheduler.runAfter(0, internal.chat.streamTranslatedResponse, {
      messageId: args.messageId,
      dutchText: result,
      languageCode: args.languageCode,
    });
  },
});

export const streamTranslatedResponse = internalAction({
  args: {
    messageId: v.id("messages"),
    dutchText: v.string(),
    languageCode: v.string(),
  },
  handler: async (ctx, args) => {
    const prompt = translateToLanguagePrompt(args.dutchText, args.languageCode);
    const response = await getPromptResponse(prompt);
    let sequence = 0;
    let result = "";

    for await (const chunk of response) {
      if (!chunk.choices[0]?.delta?.content) continue;
      result += chunk.choices[0].delta.content;
      await ctx.runMutation(internal.mutations.createMessageTranslatedChunk, {
        messageId: args.messageId,
        chunk: chunk.choices[0].delta.content,
        sequence: sequence++,
      });
    }

    await ctx.runMutation(internal.mutations.finishMessageTranslated, {
      messageId: args.messageId,
      translatedContent: result.trim(),
    });
  },
});
