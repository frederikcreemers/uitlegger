export type Language = "ar" | "tr" | "en" | "es" | "pt" | "fa";

export interface LanguageInfo {
  code: Language;
  name: string;
  englishName: string;
  nameInLanguage: string;
}

export const languages: LanguageInfo[] = [
  {
    code: "ar",
    name: "Arabisch",
    englishName: "Arabic",
    nameInLanguage: "العربية",
  },
  {
    code: "tr",
    name: "Turks",
    englishName: "Turkish",
    nameInLanguage: "Türkçe",
  },
  {
    code: "en",
    name: "Engels",
    englishName: "English",
    nameInLanguage: "English",
  },
  {
    code: "es",
    name: "Spaans",
    englishName: "Spanish",
    nameInLanguage: "Español",
  },
  {
    code: "pt",
    name: "Portugees",
    englishName: "Portuguese",
    nameInLanguage: "Português",
  },
  {
    code: "fa",
    name: "Perzisch",
    englishName: "Persian",
    nameInLanguage: "فارسی",
  },
  {
    code: "pt",
    name: "Portugees",
    englishName: "Portuguese",
    nameInLanguage: "Português",
  },
  {
    code: "fa",
    name: "Perzisch",
    englishName: "Persian",
    nameInLanguage: "فارسی",
  },
];

export const primaryLanguages: Language[] = ["ar", "tr", "en"];
export const additionalLanguages: Language[] = ["es", "pt", "fa"];

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    explain: "اشرح",
  },
  tr: {
    explain: "açıkla",
  },
  en: {
    explain: "explain",
  },
  es: {
    explain: "explicar",
  },
  pt: {
    explain: "explicar",
  },
  fa: {
    explain: "توضیح دهید",
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || key;
}
