import { CONTEXT_LINES_RANGE, MAX_CARDS_RANGE, parseFormat } from './options.js';
import type { OutputFormat } from './types.js';

export interface CliArgs {
  command: 'split' | 'summarize' | 'prompt' | 'help' | 'version';
  file?: string;
  format: OutputFormat;
  contextLines?: number;
  maxCards?: number;
  redact: boolean;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { command: 'help', format: 'text', redact: true };
  const rest = [...argv];
  const first = rest.shift();
  if (first === 'split' || first === 'summarize' || first === 'prompt') args.command = first;
  else if (first === '--version' || first === '-v' || first === 'version') args.command = 'version';
  else if (first === '--help' || first === '-h' || first === undefined || first === 'help') args.command = 'help';
  else { args.command = 'split'; args.file = first; }

  while (rest.length > 0) {
    const token = rest.shift();
    if (!token) continue;
    if (token === '--format' || token === '-f') args.format = parseFormat(requireValue(token, rest.shift()));
    else if (token.startsWith('--format=')) args.format = parseFormat(token.slice('--format='.length));
    else if (token === '--context' || token === '-c') {
      args.contextLines = parseIntegerOption('--context', requireValue(token, rest.shift()), CONTEXT_LINES_RANGE);
    } else if (token.startsWith('--context=')) {
      args.contextLines = parseIntegerOption('--context', token.slice('--context='.length), CONTEXT_LINES_RANGE);
    } else if (token === '--max-cards' || token === '-m') {
      args.maxCards = parseIntegerOption('--max-cards', requireValue(token, rest.shift()), MAX_CARDS_RANGE);
    } else if (token.startsWith('--max-cards=')) {
      args.maxCards = parseIntegerOption('--max-cards', token.slice('--max-cards='.length), MAX_CARDS_RANGE);
    }
    else if (token === '--no-redact') args.redact = false;
    else if (token === '--redact') args.redact = true;
    else if (!args.file) args.file = token;
    else throw new Error(`Unknown argument: ${token}`);
  }
  return args;
}

function requireValue(flag: string, value: string | undefined): string {
  if (!value) throw new Error(`${flag} requires a value`);
  return value;
}

function parseIntegerOption(
  flag: string,
  rawValue: string,
  range: { min: number; max: number },
): number {
  const value = rawValue.trim() === '' ? Number.NaN : Number(rawValue);
  if (!Number.isInteger(value) || value < range.min || value > range.max) {
    throw new Error(
      `${flag} must be an integer between ${range.min} and ${range.max} (received "${rawValue}")`,
    );
  }
  return value;
}
