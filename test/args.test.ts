import assert from 'node:assert/strict';
import test from 'node:test';
import { parseArgs } from '../src/args.js';

test('parseArgs defaults bare file to split command', () => {
  const args = parseArgs(['ci.log', '--format=json', '--context', '3']);
  assert.equal(args.command, 'split');
  assert.equal(args.file, 'ci.log');
  assert.equal(args.format, 'json');
  assert.equal(args.contextLines, 3);
});

test('parseArgs supports prompt command', () => {
  assert.equal(parseArgs(['prompt', 'ci.log']).command, 'prompt');
});
