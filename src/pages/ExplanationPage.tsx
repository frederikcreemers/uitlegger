import { useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { useParams, useNavigate } from "react-router";
import { Volume2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import {
  languages,
  getTranslation,
  DUTCH_DISCLAIMER,
  type Language,
} from "../lib/localizations";
import NavBar from "../components/NavBar";
import { useDutchSpeech } from "../hooks/useDutchSpeech";

const LANGUAGE_STORAGE_KEY = "uitlegger_selected_language";

function PendingExplanation({
  explanationId,
}: {
  explanationId: Id<"explanations">;
}) {
  const pendingExplanation = useQuery(api.queries.getPendingExplanation, {
    explanationId,
  });

  return <ReactMarkdown>{pendingExplanation?.text || ""}</ReactMarkdown>;
}

function PendingTranslation({
  translationId,
}: {
  translationId: Id<"translations">;
}) {
  const pendingTranslation = useQuery(api.queries.getPendingTranslation, {
    translationId,
  });

  return <ReactMarkdown>{pendingTranslation?.text || ""}</ReactMarkdown>;
}

export default function ExplanationPage() {
  const { slug, languageCode } = useParams<{
    slug: string;
    languageCode: string;
  }>();
  const navigate = useNavigate();
  const explanation = useQuery(api.queries.getExplanationPublic, {
    slug: slug!,
  });
  const translation = useQuery(api.queries.getTranslationPublic, {
    slug: slug!,
    languageCode: languageCode!,
  });
  const addMissingTranslation = useAction(
    api.explanation.addMissingTranslation
  );

  const urlLanguage = (languageCode || "en") as Language;
  const { isAvailable, speak, stop } = useDutchSpeech();

  useEffect(() => {
    if (explanation && !translation && slug && languageCode) {
      addMissingTranslation({ slug, languageCode });
    }
  }, [explanation, translation, slug, languageCode, addMissingTranslation]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const handleLanguageChange = (language: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    if (slug) {
      navigate(`/uitleg/${language}/${slug}`);
    }
  };

  if (!explanation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const languageInfo = languages.find((lang) => lang.code === languageCode);
  const translationLanguageName = languageInfo?.nameInLanguage || "Translation";

  const exampleSentences = explanation.exampleSentences || [];
  const translatedExampleSentences = translation?.exampleSentences || [];
  const maxExamples = Math.max(
    exampleSentences.length,
    translatedExampleSentences.length
  );
  const hasExamples = maxExamples > 0;

  return (
    <div className="min-h-screen bg-white">
      <NavBar
        selectedLanguage={urlLanguage}
        onLanguageChange={handleLanguageChange}
        saveToStorage={false}
      />
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            {explanation.title}
          </h1>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Nederlands
              </h2>
              <div className="text-lg text-gray-700 prose prose-lg max-w-none">
                {explanation.status === "generating" && explanation._id ? (
                  <PendingExplanation explanationId={explanation._id} />
                ) : (
                  <ReactMarkdown>{explanation.explanation}</ReactMarkdown>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {translationLanguageName}
              </h2>
              {!translation ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-gray-500">Loading translation...</div>
                </div>
              ) : (
                <div className="text-lg text-gray-700 prose prose-lg max-w-none">
                  {translation.status === "generating" && translation._id ? (
                    <PendingTranslation translationId={translation._id} />
                  ) : (
                    <ReactMarkdown>{translation.explanation}</ReactMarkdown>
                  )}
                </div>
              )}
            </div>
          </div>
          {hasExamples && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Voorbeelden / Examples
              </h3>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                        Nederlands
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">
                        {translationLanguageName}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: maxExamples }).map((_, index) => {
                      const dutchSentence = exampleSentences[index];
                      const hasDutchSentence =
                        dutchSentence && dutchSentence !== "-";
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-200 last:border-b-0"
                        >
                          <td
                            className={`px-4 py-3 text-gray-700 ${
                              hasDutchSentence && isAvailable
                                ? "cursor-pointer hover:bg-blue-50 transition-colors"
                                : ""
                            }`}
                            onClick={() => {
                              if (hasDutchSentence && isAvailable) {
                                stop();
                                speak(dutchSentence);
                              }
                            }}
                            title={
                              hasDutchSentence && isAvailable
                                ? "Klik om te horen"
                                : undefined
                            }
                          >
                            <div className="flex items-center gap-2">
                              {dutchSentence || "-"}
                              {hasDutchSentence && isAvailable && (
                                <Volume2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {translatedExampleSentences[index] || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
            <p>{DUTCH_DISCLAIMER}</p>
            <p>{getTranslation(urlLanguage, "aiDisclaimer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
