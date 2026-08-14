import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { accessSync } from 'node:fs';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

for (const [name, target] of Object.entries(pkg.bin ?? {})) {
  accessSync(new URL(`../${target}`, import.meta.url));
  console.log(`verified bin ${name} -> ${target}`);
}

for (const entry of ['dist/src', 'docs', 'examples', 'README.md', 'LICENSE', 'SECURITY.md', 'CHANGELOG.md', 'CONTRIBUTING.md']) {
  if (!pkg.files?.includes(entry)) {
    throw new Error(`package files allowlist is missing ${entry}`);
  }
}

for (const path of ['../docs/tutorials/github-actions-triage.md', '../examples/github-actions.log']) {
  accessSync(new URL(path, import.meta.url));
}

for (const field of ['repository', 'bugs', 'homepage', 'license']) {
  if (!pkg[field]) {
    throw new Error(`package metadata is missing ${field}`);
  }
}

console.log('verified package metadata, docs, examples, and files allowlist');

const tempDir = await mkdtemp(join(tmpdir(), 'cilogsplit-package-'));
try {
  const { stdout: packOutput } = await execFileAsync('npm', [
    'pack',
    '--json',
    '--pack-destination',
    tempDir,
  ]);
  const [{ filename }] = JSON.parse(packOutput);
  const installDir = join(tempDir, 'install');
  await execFileAsync('npm', [
    'install',
    '--prefix',
    installDir,
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    join(tempDir, filename),
  ]);

  const { stdout, stderr } = await execFileAsync(
    join(installDir, 'node_modules', '.bin', 'cilogsplit'),
    ['--version'],
  );
  assert.equal(stdout, `${pkg.version}\n`);
  assert.equal(stderr, '');
  console.log(`verified packed cilogsplit --version -> ${pkg.version}`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
