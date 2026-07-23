import type { OutputFormat, SplitOptions } from './types.js';

export const CONTEXT_LINES_RANGE = { min: 0, max: 50 } as const;
export const MAX_CARDS_RANGE = { min: 0, max: 100 } as const;

export const DEFAULT_OPTIONS: SplitOptions = {
  contextLines: 6,
  maxCards: 8,
  redact: true,
  format: 'text',
  includePrompts: true,
};

export function normalizeOptions(input: Partial<SplitOptions> = {}): SplitOptions {
  return {
    contextLines: clampInteger(
      input.contextLines ?? DEFAULT_OPTIONS.contextLines,
      CONTEXT_LINES_RANGE.min,
      CONTEXT_LINES_RANGE.max,
    ),
    maxCards: clampInteger(
      input.maxCards ?? DEFAULT_OPTIONS.maxCards,
      MAX_CARDS_RANGE.min,
      MAX_CARDS_RANGE.max,
    ),
    redact: input.redact ?? DEFAULT_OPTIONS.redact,
    format: input.format ?? DEFAULT_OPTIONS.format,
    includePrompts: input.includePrompts ?? DEFAULT_OPTIONS.includePrompts,
  };
}

export function parseFormat(value: string | undefined): OutputFormat {
  if (value === undefined) return DEFAULT_OPTIONS.format;
  if (value === 'text' || value === 'markdown' || value === 'json') return value;
  throw new Error(`Unsupported format "${value}". Use text, markdown, or json.`);
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}
