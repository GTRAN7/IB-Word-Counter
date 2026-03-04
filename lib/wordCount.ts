/**
 * Counts words in text according to IB-consistent rules:
 * - Hyphenated words count as 1 word
 * - Contractions count as 1 word
 * - Pure punctuation tokens don't count
 * - Each token must contain at least one word/digit character
 */
export function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Split on whitespace
  const tokens = text.trim().split(/\s+/);

  let count = 0;
  for (const token of tokens) {
    // Strip leading and trailing punctuation
    const stripped = token.replace(/^[^\w\d]+|[^\w\d]+$/g, '');
    // Require at least one word or digit character
    if (stripped.length > 0 && /[\w\d]/.test(stripped)) {
      count++;
    }
  }

  return count;
}
