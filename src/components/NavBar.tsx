import { Link } from "react-router";
import { type Language } from "../lib/localizations";
import NavBarLanguagePicker from "./NavBarLanguagePicker";

interface NavBarProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  saveToStorage?: boolean;
}

export default function NavBar({
  selectedLanguage,
  onLanguageChange,
  saveToStorage = true,
}: NavBarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            Uitlegger
          </Link>
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
        </div>
        <NavBarLanguagePicker
          selectedLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
          saveToStorage={saveToStorage}
        />
      </div>
    </nav>
  );
}
