import { sliceContext } from './parser.js';
import { buildPrompt } from './prompts.js';
import type { FailureCard, FailureHit, LogLine, SplitOptions } from './types.js';

export function groupHits(lines: LogLine[], hits: FailureHit[], options: SplitOptions): FailureCard[] {
  if (options.maxCards === 0) return [];

  const errorHits = hits.filter(hit => hit.pattern.severity === 'error');
  const primaryHits = errorHits.length > 0 ? errorHits : hits;
  const cards: FailureCard[] = [];

  for (const hit of primaryHits) {
    const hitLineStart = Math.max(1, hit.line - options.contextLines);
    const hitLineEnd = Math.min(lines.length, hit.line + options.contextLines);
    const existing = cards.find(card => hitLineStart <= card.lineEnd && hitLineEnd >= card.lineStart);
    if (existing) {
      existing.hits.push(hit);
      existing.lineStart = Math.min(existing.lineStart, hitLineStart);
      existing.lineEnd = Math.max(existing.lineEnd, hitLineEnd);
      existing.excerpt = lines.slice(existing.lineStart - 1, existing.lineEnd);
      existing.prompt = buildPrompt(existing);
      continue;
    }

    if (cards.length >= options.maxCards) continue;

    const excerpt = sliceContext(lines, hit.line, options.contextLines);
    const draft = {
      id: `card-${cards.length + 1}`,
      title: hit.pattern.label,
      severity: hit.pattern.severity,
      patternId: hit.pattern.id,
      lineStart: excerpt[0]?.number ?? hit.line,
      lineEnd: excerpt.at(-1)?.number ?? hit.line,
      firstFailureLine: hit.line,
      hits: [hit],
      excerpt,
      hint: hit.pattern.hint,
    } satisfies Omit<FailureCard, 'prompt'>;
    cards.push({ ...draft, prompt: buildPrompt(draft) });
  }

  return cards;
}
