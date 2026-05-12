export type OutputFormat = 'text' | 'markdown' | 'json';

export interface SplitOptions {
  contextLines: number;
  maxCards: number;
  redact: boolean;
  format: OutputFormat;
  includePrompts: boolean;
}

export interface LogLine {
  number: number;
  text: string;
}

export type Severity = 'error' | 'warning' | 'info';

export interface FailurePattern {
  id: string;
  label: string;
  severity: Severity;
  regex: RegExp;
  hint: string;
}

export interface FailureHit {
  line: number;
  text: string;
  pattern: FailurePattern;
}

export interface FailureCard {
  id: string;
  title: string;
  severity: Severity;
  patternId: string;
  lineStart: number;
  lineEnd: number;
  firstFailureLine: number;
  hits: FailureHit[];
  excerpt: LogLine[];
  hint: string;
  prompt: string;
}

export interface SplitResult {
  source: string;
  totalLines: number;
  cards: FailureCard[];
  summary: Summary;
}

export interface Summary {
  totalCards: number;
  totalFailures: number;
  highestSeverity: Severity | 'none';
  headline: string;
  patternCounts: Record<string, number>;
}
