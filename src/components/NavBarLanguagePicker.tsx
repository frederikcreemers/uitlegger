import { Select } from "@base-ui/react/select";
import { ChevronDown } from "lucide-react";
import { languages, type Language } from "../lib/localizations";

const LANGUAGE_STORAGE_KEY = "uitlegger_selected_language";

interface NavBarLanguagePickerProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  saveToStorage?: boolean;
}

export default function NavBarLanguagePicker({
  selectedLanguage,
  onLanguageChange,
  saveToStorage = true,
}: NavBarLanguagePickerProps) {
  const handleLanguageChange = (language: Language) => {
    if (saveToStorage) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    onLanguageChange(language);
  };

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage);

  return (
    <Select.Root
      value={selectedLanguage}
      onValueChange={(value) => {
        if (value) {
          handleLanguageChange(value as Language);
        }
      }}
    >
      <Select.Trigger className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 bg-gray-100 text-gray-900 hover:bg-gray-200">
        <Select.Value>
          {selectedLang?.nameInLanguage || selectedLanguage}
        </Select.Value>
        <ChevronDown className="w-4 h-4" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 min-w-[150px] z-50">
            <Select.List>
              {languages.map((lang) => (
                <Select.Item
                  key={lang.code}
                  value={lang.code}
                  className="px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 data-[highlighted]:bg-gray-100 transition-colors"
                >
                  <Select.ItemText>
                    <div className="text-left">
                      <div className="text-sm font-medium">{lang.nameInLanguage}</div>
                    </div>
                  </Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
