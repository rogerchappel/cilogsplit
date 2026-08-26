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

test('built CLI exits nonzero with the integer contract error for non-decimal spellings', async () => {
  const cliPath = new URL('../src/cli.js', import.meta.url);
  const cases: Array<[flag: string, value: string]> = [
    ['--context', '2.0'],
    ['--context', '1e1'],
    ['--max-cards', '0x10'],
    ['--max-cards', '0b101'],
    ['--max-cards', '1_0'],
  ];
  for (const [flag, value] of cases) {
    const failure = await execFileAsync(
      process.execPath,
      [cliPath.pathname, 'split', 'fixtures/node-failure.log', flag, value],
      { cwd: new URL('../../', import.meta.url) },
    ).then(
      () => null,
      (reason: unknown) => reason as { code?: number; stderr: string },
    );
    assert.ok(failure, `${flag} ${value} must exit with a nonzero code`);
    assert.equal(failure.code, 1, `${flag} ${value} must exit 1`);
    assert.match(failure.stderr, new RegExp(`${flag} must be an integer between `));
  }
});
