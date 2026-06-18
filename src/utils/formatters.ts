/**
 * Convert a topic slug (with underscores) to a human-readable display name.
 * Example: "transformer_attention_mechanisms" → "Transformer Attention Mechanisms"
 */
export function formatTopicName(topic: string): string {
  return topic
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Format an ISO date string into a short readable format.
 * Example: "2017-06-12" → "Jun 12, 2017"
 */
export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Truncate a long string to a given length, appending "…" if cut.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format author list for display.
 * Up to 3 authors shown; remainder collapsed to "+ N more".
 */
export function formatAuthors(authors: string[], max = 3): string {
  if (authors.length <= max) return authors.join(', ');
  return authors.slice(0, max).join(', ') + ` +${authors.length - max} more`;
}

/**
 * Generate a unique message ID for chat messages.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Convert elapsed milliseconds to a readable string.
 * Example: 65000 → "1m 5s"
 */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

/**
 * Prettify a prompt name for display.
 * Example: "find_and_summarize" → "Find And Summarize"
 */
export function formatPromptName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
