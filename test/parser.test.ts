import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLog, sliceContext } from '../src/parser.js';

test('parseLog numbers lines and normalizes newlines', () => {
  assert.deepEqual(parseLog('a\r\nb\n').map(line => line.number), [1, 2]);
});

test('sliceContext clamps around center line', () => {
  const lines = parseLog('one\ntwo\nthree\nfour');
  assert.deepEqual(sliceContext(lines, 1, 2).map(line => line.text), ['one', 'two', 'three']);
});
