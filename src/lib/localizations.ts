export type Language = "ar" | "tr" | "en" | "es" | "pt" | "fa" | "uk";

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
    code: "uk",
    name: "Oekraïens",
    englishName: "Ukrainian",
    nameInLanguage: "Українська",
  },
];

export const primaryLanguages: Language[] = ["ar", "tr", "uk"];
export const additionalLanguages: Language[] = ["es", "pt", "fa", "en"];

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    explain: "اشرح",
    aiDisclaimer:
      "يتم إنشاء التفسيرات باستخدام الذكاء الاصطناعي. قد تكون هناك أخطاء فيها",
  },
  tr: {
    explain: "açıkla",
    aiDisclaimer:
      "Açıklamalar AI kullanılarak oluşturulur. İçlerinde hatalar olabilir",
  },
  en: {
    explain: "explain",
    aiDisclaimer:
      "Explanations are generated using AI. There may be mistakes in them",
  },
  es: {
    explain: "explicar",
    aiDisclaimer:
      "Las explicaciones se generan usando IA. Puede haber errores en ellas",
  },
  pt: {
    explain: "explicar",
    aiDisclaimer:
      "As explicações são geradas usando IA. Pode haver erros nelas",
  },
  fa: {
    explain: "توضیح دهید",
    aiDisclaimer:
      "توضیحات با استفاده از هوش مصنوعی تولید می‌شوند. ممکن است اشتباهاتی در آن‌ها باشد",
  },
  uk: {
    explain: "пояснити",
    aiDisclaimer:
      "Пояснення генеруються за допомогою ШІ. У них можуть бути помилки",
  },
};

export function getTranslation(language: Language, key: string): string {
  return translations[language]?.[key] || key;
}

export const DUTCH_DISCLAIMER =
  "Uitleg wordt gegenereerd met behulp van AI. Er kunnen fouten in zitten";
