import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_OPTIONS, normalizeOptions } from '../src/options.js';

test('normalizes defaults and valid boundaries', () => {
  assert.deepEqual(normalizeOptions(), DEFAULT_OPTIONS);
  assert.equal(normalizeOptions({ contextLines: 0, maxCards: 0 }).contextLines, 0);
  assert.equal(normalizeOptions({ contextLines: 50, maxCards: 100 }).maxCards, 100);
});

test('rejects fractional and out-of-range library options', () => {
  for (const [key, value] of [['contextLines', 1.5], ['contextLines', -1], ['contextLines', 51], ['maxCards', 1.5], ['maxCards', -1], ['maxCards', 101]]) {
    assert.throws(() => normalizeOptions({ [key]: value }), RangeError, `${key}=${value}`);
  }
});
