import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLog, sliceContext } from '../src/parser.js';

test('parseLog numbers lines and normalizes newlines', () => {
  assert.deepEqual(parseLog('a\r\nb\n').map(line => line.number), [1, 2]);
});

test('parseLog discards all terminal line breaks but preserves interior blank lines', () => {
  assert.deepEqual(parseLog('a\n\n').map(line => line.text), ['a']);
  assert.deepEqual(parseLog('a\r\n\r\n').map(line => line.text), ['a']);
  assert.deepEqual(parseLog('a\n\nb\n\n').map(line => line.text), ['a', '', 'b']);
  assert.deepEqual(parseLog('\n\n'), []);
});

test('sliceContext clamps around center line', () => {
  const lines = parseLog('one\ntwo\nthree\nfour');
  assert.deepEqual(sliceContext(lines, 1, 2).map(line => line.text), ['one', 'two', 'three']);
});

test('parseLog preserves terminal controls and surrounding line numbers', () => {
  const lines = parseLog('before\n\u001b[31m::error::boom\u001b[0m\nafter');

  assert.deepEqual(lines, [
    { number: 1, text: 'before' },
    { number: 2, text: '\u001b[31m::error::boom\u001b[0m' },
    { number: 3, text: 'after' },
  ]);
});
