import type { LogLine } from './types.js';

export function parseLog(input: string): LogLine[] {
  const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Treat any run of terminal line breaks as one end-of-log delimiter;
  // interior blank lines remain meaningful log lines.
  const lines = normalized.replace(/\n+$/, '').split('\n');
  if (lines.length === 1 && lines[0] === '') return [];
  return lines.map((text, index) => ({ number: index + 1, text }));
}

export function sliceContext(lines: LogLine[], centerLine: number, contextLines: number): LogLine[] {
  const start = Math.max(1, centerLine - contextLines);
  const end = Math.min(lines.length, centerLine + contextLines);
  return lines.filter(line => line.number >= start && line.number <= end);
}
