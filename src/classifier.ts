import { DEFAULT_PATTERNS } from './patterns.js';
import type { FailureHit, FailurePattern, LogLine } from './types.js';

const ANSI_PRESENTATION_CONTROL =
  /\u001B(?:\][^\u0007\u001B]*(?:\u0007|\u001B\\)|\[[0-?]*[ -/]*[@-~]|[()][0-2A-Z]|[=>])|\u009B[0-?]*[ -/]*[@-~]/g;

function textForClassification(text: string): string {
  return text.replace(ANSI_PRESENTATION_CONTROL, '');
}

export function classifyLines(lines: LogLine[], patterns: FailurePattern[] = DEFAULT_PATTERNS): FailureHit[] {
  const hits: FailureHit[] = [];
  for (const line of lines) {
    const classificationText = textForClassification(line.text);
    const pattern = patterns.find(candidate => candidate.regex.test(classificationText));
    if (pattern) {
      hits.push({ line: line.number, text: line.text, pattern });
    }
  }
  return hits;
}

export function isErrorHit(hit: FailureHit): boolean {
  return hit.pattern.severity === 'error';
}
