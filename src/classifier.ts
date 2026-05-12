import { DEFAULT_PATTERNS } from './patterns.js';
import type { FailureHit, FailurePattern, LogLine } from './types.js';

export function classifyLines(lines: LogLine[], patterns: FailurePattern[] = DEFAULT_PATTERNS): FailureHit[] {
  const hits: FailureHit[] = [];
  for (const line of lines) {
    const pattern = patterns.find(candidate => candidate.regex.test(line.text));
    if (pattern) {
      hits.push({ line: line.number, text: line.text, pattern });
    }
  }
  return hits;
}

export function isErrorHit(hit: FailureHit): boolean {
  return hit.pattern.severity === 'error';
}
