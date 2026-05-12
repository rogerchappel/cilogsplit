import { readFile } from 'node:fs/promises';
import { readInput } from './io.js';
import { renderJson, renderMarkdown, renderResult, renderText } from './render.js';
import { splitLog } from './split.js';
import type { CliArgs } from './args.js';

export async function runCommand(args: CliArgs): Promise<string> {
  if (args.command === 'version') return `${await readVersion()}\n`;
  const input = await readInput(args.file);
  const result = splitLog(input.text, input.source, {
    format: args.format,
    contextLines: args.contextLines,
    maxCards: args.maxCards,
    redact: args.redact,
    includePrompts: args.command !== 'summarize',
  });

  if (args.command === 'summarize') {
    const summaryOnly = { ...result, cards: [] };
    if (args.format === 'json') return renderJson({ ...summaryOnly, summary: result.summary });
    if (args.format === 'markdown') return `# CI log summary\n\n${result.summary.headline}\n`;
    return `${result.summary.headline}\n`;
  }

  if (args.command === 'prompt') {
    return result.cards.length === 0
      ? 'No failure prompts generated.\n'
      : result.cards.map(card => card.prompt).join('\n\n---\n\n') + '\n';
  }

  return renderResult(result, args.format);
}

async function readVersion(): Promise<string> {
  const pkgUrl = new URL('../package.json', import.meta.url);
  const pkg = JSON.parse(await readFile(pkgUrl, 'utf8')) as { version: string };
  return pkg.version;
}
