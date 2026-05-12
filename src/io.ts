import { readFile } from 'node:fs/promises';

export async function readInput(path: string | undefined): Promise<{ source: string; text: string }> {
  if (!path || path === '-') {
    return { source: 'stdin', text: await readStdin() };
  }
  return { source: path, text: await readFile(path, 'utf8') };
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}
