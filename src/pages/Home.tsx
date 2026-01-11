import { useState } from "react";
import { useAction } from "convex/react";
import { useNavigate } from "react-router";
import { api } from "../../convex/_generated/api";
import LanguagePicker from "../components/LanguagePicker";
import { getTranslation, DUTCH_DISCLAIMER, type Language } from "../lib/localizations";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [searchTerm, setSearchTerm] = useState("");
  const explain = useAction(api.explanation.explain);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const result = await explain({
        query: searchTerm,
        languageCode: selectedLanguage,
      });
      navigate(`/uitleg/${selectedLanguage}/${result.slug}`);
    } catch (error) {
      console.error("Error explaining:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-12">
        <h1 className="text-6xl font-bold text-gray-900 text-center">Uitlegger</h1>

        <div className="space-y-4">
          <label className="text-lg text-gray-700 font-medium">Ik spreek:</label>
          <LanguagePicker
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Voer een term of zin in..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Leg uit
            <span className="ml-2 text-sm font-normal opacity-90">
              ({getTranslation(selectedLanguage, "explain")})
            </span>
          </button>
        </form>
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>{DUTCH_DISCLAIMER}</p>
          <p>{getTranslation(selectedLanguage, "aiDisclaimer")}</p>
        </div>
      </div>
    </div>
  );
}

