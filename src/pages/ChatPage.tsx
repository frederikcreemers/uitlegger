import { useEffect, useRef, useState } from "react";
import { useQuery, useAction } from "convex/react";
import { useParams, useNavigate } from "react-router";
import ReactMarkdown from "react-markdown";
import type { Id, Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import {
  languages,
  getTranslation,
  DUTCH_DISCLAIMER,
  type Language,
} from "../lib/localizations";
import NavBar from "../components/NavBar";

const CHAT_CONVERSATION_KEY = "uitlegger_chat_conversation_id";
const LANGUAGE_STORAGE_KEY = "uitlegger_selected_language";

function PendingDutchMessage({ messageId }: { messageId: Id<"messages"> }) {
  const pending = useQuery(api.queries.getPendingMessageDutch, { messageId });
  return <ReactMarkdown>{pending?.text || ""}</ReactMarkdown>;
}

function PendingTranslatedMessage({
  messageId,
}: {
  messageId: Id<"messages">;
}) {
  const pending = useQuery(api.queries.getPendingMessageTranslated, {
    messageId,
  });
  return <ReactMarkdown>{pending?.text || ""}</ReactMarkdown>;
}

export default function ChatPage() {
  const { languageCode } = useParams<{ languageCode?: string }>();
  const navigate = useNavigate();
  const urlLanguage = (languageCode || "en") as Language;
  const [storedConversationId, setStoredConversationId] = useState<
    string | null
  >(null);
  const [input, setInput] = useState("");
  const [contentIsDutch, setContentIsDutch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dutchScrollRef = useRef<HTMLDivElement>(null);
  const translatedScrollRef = useRef<HTMLDivElement>(null);

  const conversationId = storedConversationId
    ? (storedConversationId as Id<"conversations">)
    : undefined;

  const conversation = useQuery(
    api.queries.getConversation,
    conversationId ? { conversationId } : "skip",
  );
  const messages = useQuery(
    api.queries.getMessages,
    conversationId ? { conversationId } : "skip",
  );
  const sendMessageAction = useAction(api.chat.sendMessage);

  useEffect(() => {
    const id = localStorage.getItem(CHAT_CONVERSATION_KEY);
    if (id) setStoredConversationId(id);
  }, []);

  useEffect(() => {
    if (conversationId && conversation === null) {
      localStorage.removeItem(CHAT_CONVERSATION_KEY);
      setStoredConversationId(null);
    }
  }, [conversationId, conversation]);

  const scrollToBottom = () => {
    dutchScrollRef.current?.scrollTo({
      top: dutchScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
    translatedScrollRef.current?.scrollTo({
      top: translatedScrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!messages?.length) return;
    scrollToBottom();
  }, [messages?.length]);

  const hasGeneratingMessage = messages?.some(
    (m) =>
      m.status === "generating_dutch" || m.status === "generating_translation",
  );

  useEffect(() => {
    if (!hasGeneratingMessage) return;
    const interval = setInterval(scrollToBottom, 300);
    return () => clearInterval(interval);
  }, [hasGeneratingMessage]);

  const prevGeneratingRef = useRef(hasGeneratingMessage);
  useEffect(() => {
    if (prevGeneratingRef.current && !hasGeneratingMessage) {
      requestAnimationFrame(() => scrollToBottom());
    }
    prevGeneratingRef.current = hasGeneratingMessage;
  }, [hasGeneratingMessage]);

  const handleLanguageChange = (language: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    navigate(`/praat/${language}`);
  };

  const handleNewConversation = () => {
    localStorage.removeItem(CHAT_CONVERSATION_KEY);
    setStoredConversationId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const id = await sendMessageAction({
        conversationId,
        content: input.trim(),
        contentIsDutch,
        languageCode: urlLanguage,
      });
      if (!storedConversationId) {
        localStorage.setItem(CHAT_CONVERSATION_KEY, id);
        setStoredConversationId(id);
      }
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const languageInfo = languages.find((lang) => lang.code === urlLanguage);
  const translationLanguageName = languageInfo?.nameInLanguage || "Translation";

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <NavBar
        selectedLanguage={urlLanguage}
        onLanguageChange={handleLanguageChange}
        saveToStorage={false}
      />
      <div className="flex-1 flex flex-col min-h-0 px-4 py-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-center gap-4 mb-4 flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Praat met de uitlegger
          </h1>
          <button
            type="button"
            onClick={handleNewConversation}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
          >
            Nieuwe conversatie
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden min-h-0">
            <h2 className="px-4 py-3 bg-gray-100 text-lg font-semibold text-gray-800 border-b border-gray-200 flex-shrink-0">
              Nederlands
            </h2>
            <div
              ref={dutchScrollRef}
              className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto"
            >
              <div className="text-sm text-gray-500 italic pb-2 border-b border-gray-100">
                {DUTCH_DISCLAIMER}
              </div>
              {messages?.map((msg: Doc<"messages">) => (
                <div
                  key={msg._id}
                  className={
                    msg.role === "user"
                      ? "flex flex-col items-end"
                      : "flex flex-col items-start"
                  }
                >
                  <span className="text-xs text-gray-400 block mb-1">
                    {msg.role === "user" ? "Jij" : "Uitlegger"}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm prose prose-sm prose-invert max-w-none [&_a]:text-blue-200 [&_a]:underline"
                        : "bg-gray-200 text-gray-800 rounded-tl-sm prose prose-sm max-w-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <ReactMarkdown>{msg.dutchContent}</ReactMarkdown>
                    ) : msg.status === "generating_dutch" ? (
                      <PendingDutchMessage messageId={msg._id} />
                    ) : (
                      <ReactMarkdown>{msg.dutchContent}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden min-h-0">
            <h2 className="px-4 py-3 bg-gray-100 text-lg font-semibold text-gray-800 border-b border-gray-200 flex-shrink-0">
              {translationLanguageName}
            </h2>
            <div
              ref={translatedScrollRef}
              className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto"
            >
              <div className="text-sm text-gray-500 italic pb-2 border-b border-gray-100">
                {getTranslation(urlLanguage, "aiDisclaimer")}
              </div>
              {messages?.map((msg: Doc<"messages">) => (
                <div
                  key={msg._id}
                  className={
                    msg.role === "user"
                      ? "flex flex-col items-end"
                      : "flex flex-col items-start"
                  }
                >
                  <span className="text-xs text-gray-400 block mb-1">
                    {msg.role === "user" ? "You" : "Uitlegger"}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm prose prose-sm prose-invert max-w-none [&_a]:text-blue-200 [&_a]:underline"
                        : "bg-gray-200 text-gray-800 rounded-tl-sm prose prose-sm max-w-none"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <ReactMarkdown>{msg.translatedContent}</ReactMarkdown>
                    ) : msg.status === "generating_dutch" ? (
                      <span className="text-gray-400">...</span>
                    ) : msg.status === "generating_translation" ? (
                      <PendingTranslatedMessage messageId={msg._id} />
                    ) : (
                      <ReactMarkdown>{msg.translatedContent}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 flex-shrink-0">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="lang"
                checked={contentIsDutch}
                onChange={() => setContentIsDutch(true)}
                className="rounded"
              />
              <span className="text-sm">Stuur in het Nederlands</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="lang"
                checked={!contentIsDutch}
                onChange={() => setContentIsDutch(false)}
                className="rounded"
              />
              <span className="text-sm">
                Stuur in {translationLanguageName}
              </span>
            </label>
          </div>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !isSubmitting) {
                    (
                      e.currentTarget.form as HTMLFormElement | null
                    )?.requestSubmit();
                  }
                }
              }}
              placeholder={
                contentIsDutch ? "Typ je bericht..." : "Type your message..."
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
              rows={3}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              Verstuur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
