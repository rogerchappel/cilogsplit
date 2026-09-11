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

test('built CLI keeps CI identifiers while masking secrets in redacted cards', async () => {
  const cliPath = new URL('../src/cli.js', import.meta.url);
  const { stdout } = await execFileAsync(
    process.execPath,
    [cliPath.pathname, 'split', 'fixtures/redaction-failure.log', '--format', 'text'],
    { cwd: new URL('../../', import.meta.url) },
  );

  // The FAIL line is the most useful field of a failure card; redaction must
  // not erase it or the surrounding commit/digest identifiers.
  assert.match(stdout, /FAIL src\/deeply\/nested\/module\/file\/name\/with\/long\/path\/thing\.test\.ts/);
  assert.match(stdout, /Resolved head 0123456789abcdef0123456789abcdef01234567/);
  assert.match(stdout, /sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855/);
  assert.match(stdout, /expected sha512-abcdefghijKLMNOPQRSTUVwxyz0123456789\+\/abcdefghijKLMNOPQRSTUVwxyz0123456789\+\/ab==/);

  // Secret material must never reach rendered output, and assignment masking
  // keeps the original separator verbatim.
  assert.doesNotMatch(stdout, /supersecretvalue123/);
  assert.doesNotMatch(stdout, /ghp_[A-Za-z0-9_]{20,}/);
  assert.doesNotMatch(stdout, /AKIAIOSFODNN7EXAMPLE/);
  assert.match(stdout, /api_token: \*\*\*/);
  assert.match(stdout, /token gh_\*\*\*/);
  assert.match(stdout, /id AKIA\*\*\*/);
});

test('built CLI reproduces the raw fixture with --no-redact', async () => {
  const cliPath = new URL('../src/cli.js', import.meta.url);
  const { stdout } = await execFileAsync(
    process.execPath,
    [cliPath.pathname, 'split', 'fixtures/redaction-failure.log', '--format', 'text', '--no-redact'],
    { cwd: new URL('../../', import.meta.url) },
  );

  assert.match(stdout, /api_token: supersecretvalue123/);
  assert.match(stdout, /ghp_abcdefghijklmnopqrstuvwxyz123456/);
});
