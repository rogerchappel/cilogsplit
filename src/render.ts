import type { FailureCard, SplitResult } from './types.js';

export function renderText(result: SplitResult): string {
  const parts = [`cilogsplit: ${result.summary.headline}`, `source: ${result.source}; lines: ${result.totalLines}`];
  for (const card of result.cards) {
    parts.push('', formatCardHeader(card), `hint: ${card.hint}`, 'excerpt:');
    parts.push(...card.excerpt.map(line => `${String(line.number).padStart(5)} | ${line.text}`));
  }
  return parts.join('\n') + '\n';
}

export function renderMarkdown(result: SplitResult): string {
  const parts = [
    `# CI log split`,
    '',
    `**Source:** ${escapeMd(result.source)}`,
    `**Lines:** ${result.totalLines}`,
    `**Summary:** ${escapeMd(result.summary.headline)}`,
  ];

  for (const card of result.cards) {
    const excerpt = card.excerpt.map(line => `${line.number}: ${line.text}`);
    const excerptFence = markdownFence(excerpt.join('\n'), 3);
    parts.push('', `## ${escapeMd(card.id)} — ${escapeMd(card.title)}`, '', `- Severity: ${card.severity}`, `- Lines: ${card.lineStart}-${card.lineEnd}`, `- Hint: ${escapeMd(card.hint)}`, '', `${excerptFence}text`);
    parts.push(...excerpt);
    parts.push(excerptFence);
    if (card.prompt) {
      const promptFence = markdownFence(card.prompt, 4);
      parts.push('', '<details><summary>Agent prompt</summary>', '', `${promptFence}text`, card.prompt, promptFence, '', '</details>');
    }
  }

  return parts.join('\n') + '\n';
}

export function renderJson(result: SplitResult): string {
  return `${JSON.stringify(result, null, 2)}\n`;
}

export function renderResult(result: SplitResult, format: 'text' | 'markdown' | 'json'): string {
  if (format === 'json') return renderJson(result);
  if (format === 'markdown') return renderMarkdown(result);
  return renderText(result);
}

function formatCardHeader(card: FailureCard): string {
  return `${card.id}: ${card.title} (${card.severity}) lines ${card.lineStart}-${card.lineEnd}`;
}

function escapeMd(value: string): string {
  return value.replace(/[<>]/g, match => (match === '<' ? '&lt;' : '&gt;'));
}

function markdownFence(content: string, minimumLength: number): string {
  const longestRun = Math.max(0, ...Array.from(content.matchAll(/`+/g), match => match[0].length));
  return '`'.repeat(Math.max(minimumLength, longestRun + 1));
}
