import { sliceContext } from './parser.js';
import { buildPrompt } from './prompts.js';
import type { FailureCard, FailureHit, LogLine, SplitOptions } from './types.js';

export function groupHits(lines: LogLine[], hits: FailureHit[], options: SplitOptions): FailureCard[] {
  const errorHits = hits.filter(hit => hit.pattern.severity === 'error');
  const primaryHits = errorHits.length > 0 ? errorHits : hits;
  const cards: FailureCard[] = [];

  for (const hit of primaryHits) {
    const existing = cards.find(card => Math.abs(card.firstFailureLine - hit.line) <= options.contextLines);
    if (existing) {
      existing.hits.push(hit);
      existing.lineStart = Math.min(existing.lineStart, Math.max(1, hit.line - options.contextLines));
      existing.lineEnd = Math.max(existing.lineEnd, Math.min(lines.length, hit.line + options.contextLines));
      continue;
    }

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
    if (cards.length >= options.maxCards) break;
  }

  return cards;
}
