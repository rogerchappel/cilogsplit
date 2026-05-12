import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyLines } from '../src/classifier.js';
import { parseLog } from '../src/parser.js';

test('classifyLines identifies TypeScript diagnostics', () => {
  const hits = classifyLines(parseLog("src/a.ts:1:1 - error TS2307: Cannot find module 'x'"));
  assert.equal(hits[0]?.pattern.id, 'typescript-error');
});

test('classifyLines identifies dependency failures', () => {
  const hits = classifyLines(parseLog('npm ERR! code ERESOLVE'));
  assert.equal(hits[0]?.pattern.id, 'dependency-install');
});
