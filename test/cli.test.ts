import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

test('built CLI prints the package version', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8')) as {
    version: string;
  };
  const cliPath = new URL('../src/cli.js', import.meta.url);

  const { stdout, stderr } = await execFileAsync(process.execPath, [cliPath.pathname, '--version']);

  assert.equal(stdout, `${pkg.version}\n`);
  assert.equal(stderr, '');
});
