import { useEffect } from "react";
import { Select } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import { languages, primaryLanguages, additionalLanguages, type Language } from "../lib/localizations";

const LANGUAGE_STORAGE_KEY = "uitlegger_selected_language";

interface LanguagePickerProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export default function LanguagePicker({ selectedLanguage, onLanguageChange }: LanguagePickerProps) {
  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && languages.some((lang) => lang.code === storedLanguage)) {
      onLanguageChange(storedLanguage as Language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = (language: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    onLanguageChange(language);
  };

  const primaryLangs = languages.filter((lang) => primaryLanguages.includes(lang.code));
  const additionalLangs = languages.filter((lang) => additionalLanguages.includes(lang.code));

  const selectedAdditionalLang = additionalLangs.find((lang) => lang.code === selectedLanguage);
  const isAdditionalLangSelected = selectedAdditionalLang !== undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {primaryLangs.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedLanguage === lang.code
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <div className="text-lg">{lang.nameInLanguage}</div>
            <div className="text-sm opacity-75">{lang.name}</div>
          </button>
        ))}
        <Select.Root
          value={isAdditionalLangSelected ? selectedLanguage : undefined}
          onValueChange={(value) => {
            if (value) {
              handleLanguageChange(value as Language);
            }
          }}
        >
          <Select.Trigger
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isAdditionalLangSelected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            <Select.Value>
              {selectedAdditionalLang ? (
                <div className="text-left">
                  <div className="text-lg">{selectedAdditionalLang.nameInLanguage}</div>
                  <div className="text-sm opacity-75">{selectedAdditionalLang.name}</div>
                </div>
              ) : (
                "Meer talen"
              )}
            </Select.Value>
            <ChevronDown className="w-4 h-4" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 min-w-[200px] z-50">
                <Select.List>
                  {additionalLangs.map((lang) => (
                    <Select.Item
                      key={lang.code}
                      value={lang.code}
                      className="px-4 py-3 rounded-md cursor-pointer hover:bg-gray-100 data-[highlighted]:bg-gray-100 transition-colors"
                    >
                      <Select.ItemText>
                        <div className="text-left">
                          <div className="text-base font-medium">{lang.nameInLanguage}</div>
                          <div className="text-sm text-gray-600">{lang.name}</div>
                        </div>
                      </Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}

