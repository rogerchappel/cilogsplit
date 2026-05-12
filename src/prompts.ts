import type { FailureCard } from './types.js';

export function buildPrompt(card: Omit<FailureCard, 'prompt'>): string {
  const excerpt = card.excerpt.map(line => `${line.number}: ${line.text}`).join('\n');
  return [
    `You are debugging a CI failure card from cilogsplit.`,
    `Failure: ${card.title}`,
    `Severity: ${card.severity}`,
    `Lines: ${card.lineStart}-${card.lineEnd}; first failure line ${card.firstFailureLine}`,
    `Likely hint: ${card.hint}`,
    '',
    'Relevant log excerpt:',
    '```text',
    excerpt,
    '```',
    '',
    'Please identify the likely root cause, suggest the smallest fix, and list a verification command.',
  ].join('\n');
}
