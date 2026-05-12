import type { LogLine } from './types.js';

export function parseLog(input: string): LogLine[] {
  const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.endsWith('\n') ? normalized.slice(0, -1).split('\n') : normalized.split('\n');
  if (lines.length === 1 && lines[0] === '') return [];
  return lines.map((text, index) => ({ number: index + 1, text }));
}

export function sliceContext(lines: LogLine[], centerLine: number, contextLines: number): LogLine[] {
  const start = Math.max(1, centerLine - contextLines);
  const end = Math.min(lines.length, centerLine + contextLines);
  return lines.filter(line => line.number >= start && line.number <= end);
}
