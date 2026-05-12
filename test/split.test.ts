import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { splitLog } from '../src/split.js';

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
