export function slugify(text: string): string {
  return encodeURIComponent(text.trim().toLowerCase().replace(/\s+/g, "_"));
}

export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}
