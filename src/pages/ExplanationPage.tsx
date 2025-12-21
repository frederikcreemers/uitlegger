import { useQuery } from "convex/react";
import { useParams } from "react-router";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

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

export default function ExplanationPage() {
  const { slug } = useParams<{ slug: string }>();
  const explanation = useQuery(api.queries.getExplanationPublic, {
    slug: slug!,
  });

  if (!explanation) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          {explanation.title}
        </h1>
        <p className="text-lg text-gray-700 whitespace-pre-wrap">
          {explanation.status === "generating" && explanation._id ? (
            <PendingExplanation explanationId={explanation._id} />
          ) : (
            explanation.explanation
          )}
        </p>
      </div>
    </div>
  );
}
