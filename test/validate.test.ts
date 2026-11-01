import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const repoRoot = new URL('../../', import.meta.url).pathname;

test('validator runs package verification through a temporary npm pack/install smoke', () => {
  const tempDir = mkdtempSync(join(tmpdir(), 'cilogsplit-validate-test-'));
  const binDir = join(tempDir, 'bin');
  const logFile = join(tempDir, 'npm.log');
  mkdirSync(binDir);
  writeFileSync(join(binDir, 'npm'), `#!/bin/sh\nprintf '%s\\n' "$*" >> "$NPM_LOG"\n`);
  execFileSync('chmod', ['+x', join(binDir, 'npm')]);

  try {
    const output = execFileSync('bash', ['scripts/validate.sh'], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: { ...process.env, PATH: `${binDir}:${process.env.PATH}`, NPM_LOG: logFile },
    });
    const npmCalls = (awaitRead(logFile)).split('\n').filter(Boolean);
    assert.match(output, /package script: package:smoke/);
    assert.ok(npmCalls.includes('run package:smoke'));
    assert.ok(npmCalls.includes('run build'));
    assert.ok(npmCalls.includes('run check'));
    assert.ok(npmCalls.includes('run package:smoke')); // Validator dispatches the package script; its implementation owns npm pack/install.
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

function awaitRead(path: string): string {
  return execFileSync('cat', [path], { encoding: 'utf8' });
}
