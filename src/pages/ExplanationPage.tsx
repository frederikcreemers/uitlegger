import { useEffect } from "react";
import { useQuery, useAction } from "convex/react";
import { useParams } from "react-router";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { languages, type Language } from "../lib/localizations";

function PendingExplanation({
  explanationId,
}: {
  explanationId: Id<"explanations">;
}) {
  const pendingExplanation = useQuery(api.queries.getPendingExplanation, {
    explanationId,
  });

  return <>{pendingExplanation?.text || ""}</>;
}

function PendingTranslation({
  translationId,
}: {
  translationId: Id<"translations">;
}) {
  const pendingTranslation = useQuery(api.queries.getPendingTranslation, {
    translationId,
  });

  return <>{pendingTranslation?.text || ""}</>;
}

export default function ExplanationPage() {
  const { slug, languageCode } = useParams<{
    slug: string;
    languageCode: string;
  }>();
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

  useEffect(() => {
    if (explanation && !translation && slug && languageCode) {
      addMissingTranslation({ slug, languageCode });
    }
  }, [explanation, translation, slug, languageCode, addMissingTranslation]);

  if (!explanation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const languageInfo = languages.find((lang) => lang.code === languageCode);
  const translationLanguageName = languageInfo?.nameInLanguage || "Translation";

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          {explanation.title}
        </h1>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Nederlands</h2>
            <p className="text-lg text-gray-700 whitespace-pre-wrap">
              {explanation.status === "generating" && explanation._id ? (
                <PendingExplanation explanationId={explanation._id} />
              ) : (
                explanation.explanation
              )}
            </p>
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
              <p className="text-lg text-gray-700 whitespace-pre-wrap">
                {translation.status === "generating" && translation._id ? (
                  <PendingTranslation translationId={translation._id} />
                ) : (
                  translation.explanation
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
