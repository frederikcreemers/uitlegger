import { languages } from "../lib/localizations";

export function dutchExplanationPrompt(query: string) {
  return `
  Please give an explanation in Dutch for the Dutch word or phrase: ${query}.
  The explanation should be short and concise, and use simple language.
  If the expression seems misspelled, point it out. If it's an expression in a regional dialect, say where it's from.
  The question comes from someone trying to learn Dutch in Belgium, so if an expression is more common in the Netherlands, or can have a different connotation there, point that out too.
  If the expression is used the same in belgium and the Netherlands, then DO NOT point it out specifically.

  Try to limit the explanation to one paragraph.
  Do not example sentences, unless it is necessary for the explanation. we will create examples later.

  If you are unsure about the meaning, and think more context could help, end your response with "UNSURE" on a new line.
  We'll show the learner a prompt for more context in that case.
  `;
}

export function translationPrompt(query: string, languageCode: string) {
  // get the language name from the language code
  const languageName = languages.find(
    (language) => language.code === languageCode
  )?.englishName;

  return `
  Give an explanation in ${languageName} for the Dutch word or phrase: ${query}.
  The explanation should be short and concise, and use simple language.
  If the expression seems misspelled, point it out. If it's an expression in a regional dialect, say where it's from.
  The question comes from someone trying to learn Dutch in Belgium, so if an expression is more common in the Netherlands, or can have a different connotation there, point that out too.
  If the expression is used the same in belgium and the Netherlands, then DO NOT point it out specifically.
  If the word or phrase has a direct translation in ${languageName}, then give that translation, but also mention the Dutch word or phrase.

  Try to limit the explanation to one paragraph.
  Do not example sentences, unless it is necessary for the explanation. we will create examples later.
  `;
}

export function exampleSentencePrompt(query: string) {
  return `
  Give 10 example sentences in Dutch for the Dutch word or phrase: ${query}.
  The example sentences should be short and concise, and use simple language.
  If it's a verb, make sure to include different conjugations and tenses.
  If there are multiple meanings, make sure to include all of them.
  Return the sentences as a JSON array of strings.
  `;
}

export function exampleSentenceTranslationPrompt(
  _query: string,
  sentences: string[],
  languageCode: string
) {
  const languageName = languages.find(
    (language) => language.code === languageCode
  )?.englishName;

  return `
    Translate the following sentences into ${languageName}:

    ${sentences.map((sentence) => `- ${sentence}`).join("\n")}

    Return the translations as a JSON array of strings.
  `;
}
