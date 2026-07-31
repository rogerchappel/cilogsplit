import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { splitLog, splitLogLines } from '../src/index.js';

test('splitLog creates failure cards from node fixture', async () => {
  const log = await readFile('fixtures/node-failure.log', 'utf8');
  const result = splitLog(log, 'node fixture', { contextLines: 2 });
  assert.equal(result.cards[0]?.patternId, 'node-test-fail');
  assert.match(result.summary.headline, /failure card/);
});

test('splitLog respects maxCards', async () => {
  const log = await readFile('fixtures/install-failure.log', 'utf8');
  const result = splitLog(log, 'install fixture', { maxCards: 1 });
  assert.equal(result.cards.length, 1);
});

test('splitLog supports a zero-card limit', async () => {
  const log = await readFile('fixtures/install-failure.log', 'utf8');
  const result = splitLog(log, 'install fixture', { maxCards: 0 });
  assert.equal(result.cards.length, 0);
  assert.equal(result.summary.totalCards, 0);
});

test('splitLog rebuilds context and prompts when boundary hits merge', () => {
  const log = Array.from({ length: 16 }, (_, index) => {
    const line = index + 1;
    if (line === 10) return 'src/a.ts(10,1): error TS2322: first failure';
    if (line === 13) return 'src/b.ts(13,1): error TS2345: boundary failure';
    return `context line ${line}`;
  }).join('\n');

  const result = splitLog(log, 'boundary fixture', { contextLines: 3 });
  const card = result.cards[0];

  assert.ok(card);
  assert.equal(result.cards.length, 1);
  assert.equal(card.hits.length, 2);
  assert.equal(card.lineStart, 7);
  assert.equal(card.lineEnd, 16);
  assert.deepEqual(card.excerpt.map(line => line.number), [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
  assert.match(card.prompt, /Lines: 7-16; first failure line 10/);
  assert.match(card.prompt, /16: context line 16/);
});

const recognizedFailureLines = [
  'installing dependencies',
  'npm ERR! token ghp_abcdefghijklmnopqrstuvwxyz123456',
  'cleanup complete',
];

for (const options of [{ redact: false }, {}, { redact: true }]) {
  const label = 'redact' in options ? `redact: ${options.redact}` : 'default redaction';

  test(`splitLogLines matches splitLog with ${label}`, () => {
    const fromText = splitLog(recognizedFailureLines.join('\n'), 'inline', options);
    const fromLines = splitLogLines(recognizedFailureLines, 'inline', options);

    assert.deepEqual(fromLines, fromText);
    assert.equal(fromLines.summary.totalFailures, 1);

    const card = fromLines.cards[0];
    assert.ok(card);
    const expectedToken = options.redact === false
      ? 'ghp_abcdefghijklmnopqrstuvwxyz123456'
      : 'gh_***';

    assert.ok(card.hits[0]?.text.includes(expectedToken));
    assert.ok(card.excerpt[1]?.text.includes(expectedToken));
    assert.ok(card.prompt.includes(expectedToken));
  });
}
