export type Language = "ar" | "tr" | "en" | "es" | "pt" | "fa";

export interface LanguageInfo {
  code: Language;
  name: string;
  nameInLanguage: string;
}

export const languages: LanguageInfo[] = [
  { code: "ar", name: "Arabisch", nameInLanguage: "العربية" },
  { code: "tr", name: "Turks", nameInLanguage: "Türkçe" },
  { code: "en", name: "Engels", nameInLanguage: "English" },
  { code: "es", name: "Spaans", nameInLanguage: "Español" },
  { code: "pt", name: "Portugees", nameInLanguage: "Português" },
  { code: "fa", name: "Perzisch", nameInLanguage: "فارسی" },
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

