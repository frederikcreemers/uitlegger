import { useState } from "react";
import LanguagePicker from "../components/LanguagePicker";
import { getTranslation, type Language } from "../lib/localizations";

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle search
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
      </div>
    </div>
  );
}

