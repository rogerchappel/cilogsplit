import { classifyLines } from './classifier.js';
import { groupHits } from './grouping.js';
import { normalizeOptions } from './options.js';
import { parseLog } from './parser.js';
import { redactLines, redactText } from './redact.js';
import { summarizeCards } from './summary.js';
import type { SplitOptions, SplitResult } from './types.js';

export function splitLog(input: string, source = 'stdin', optionsInput: Partial<SplitOptions> = {}): SplitResult {
  const options = normalizeOptions(optionsInput);
  const safeInput = options.redact ? redactText(input) : input;
  const lines = parseLog(safeInput);
  const hits = classifyLines(lines);
  const cards = groupHits(lines, hits, options).map(card => ({
    ...card,
    excerpt: options.redact ? card.excerpt.map(line => ({ ...line, text: redactText(line.text) })) : card.excerpt,
    hits: options.redact ? card.hits.map(hit => ({ ...hit, text: redactText(hit.text) })) : card.hits,
    prompt: options.includePrompts ? card.prompt : '',
  }));

  return {
    source,
    totalLines: lines.length,
    cards,
    summary: summarizeCards(cards),
  };
}

export function splitLogLines(lines: string[], source = 'stdin', optionsInput: Partial<SplitOptions> = {}): SplitResult {
  return splitLog(redactLines(lines).join('\n'), source, optionsInput);
}
