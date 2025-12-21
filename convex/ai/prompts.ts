export function dutchExplanationPrompt(query: string) {
  return `
  Please give an explanation in Dutch for the Dutch word or phrase: ${query}.
  The explanation should be short and concise, and use simple language.
  If the expression seems misspelled, point it out. If it's an expression in a regional dialect, say where it's from.
  The question comes from someone trying to learn Dutch in Belgium, so if an expression is more common in the Netherlands, or can have a different connotation there, point that out too.

  If you are unsure about the meaning, and think more context could help, end your response with "UNSURE" on a new line.
  We'll show the learner a prompt for more context in that case.
  `;
}
