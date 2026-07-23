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

test('classifyLines treats plain and colored GitHub annotations identically', () => {
  const plain = classifyLines(parseLog('::error file=x.js,line=1::boom'));
  const colored = classifyLines(parseLog('\u001b[31m::error file=x.js,line=1::boom\u001b[0m'));

  assert.equal(plain[0]?.pattern.id, 'github-actions-error');
  assert.equal(colored[0]?.pattern.id, plain[0]?.pattern.id);
  assert.equal(colored[0]?.line, plain[0]?.line);
  assert.equal(colored[0]?.text, '\u001b[31m::error file=x.js,line=1::boom\u001b[0m');
});

test('classifyLines preserves the line number of a colored annotation in context', () => {
  const hits = classifyLines(parseLog([
    'Run npm test',
    '\u001b[1;31m::error file=x.js,line=1::boom\u001b[0m',
    'Process completed with exit code 1.',
  ].join('\n')));

  assert.deepEqual(hits.map(hit => [hit.line, hit.pattern.id]), [
    [2, 'github-actions-error'],
    [3, 'github-actions-error'],
  ]);
});
