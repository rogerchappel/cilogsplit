import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const installSection = readme.match(/^## Install\s*([\s\S]*?)(?=^## )/m)?.[1];

assert.ok(installSection, 'README must include an Install section');
assert.match(installSection, /npm package is not available until the first tagged release is published/i,
  'Install guidance must state that npm installation depends on the first tagged release');
assert.match(installSection, /npm install -g cilogsplit[\s\S]*?cilogsplit --help/,
  'Install guidance must show the published npm installation and executable');
assert.match(installSection, /npm run build[\s\S]*?node dist\/src\/cli\.js --help/,
  'Pre-release clone instructions must build and run the CLI directly');
assert.equal(packageJson.bin?.cilogsplit, './dist/src/cli.js',
  'README executable instructions must match the package bin target');
