#!/usr/bin/env node
import { parseArgs } from './args.js';
import { runCommand } from './commands.js';
import { helpText } from './help.js';

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === 'help') {
    process.stdout.write(helpText());
    return;
  }
  process.stdout.write(await runCommand(args));
}

main().catch(error => {
  process.stderr.write(`cilogsplit: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
