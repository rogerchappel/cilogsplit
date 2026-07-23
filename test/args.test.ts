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

test('parseArgs accepts numeric option boundary values', () => {
  const args = parseArgs(['split', 'ci.log', '--context=0', '--max-cards', '0']);
  assert.equal(args.contextLines, 0);
  assert.equal(args.maxCards, 0);

  const upperBounds = parseArgs(['split', 'ci.log', '--context', '50', '--max-cards=100']);
  assert.equal(upperBounds.contextLines, 50);
  assert.equal(upperBounds.maxCards, 100);
});

test('parseArgs rejects invalid numeric options with the accepted range', () => {
  for (const [flag, value, range] of [
    ['--context', '1.5', '0 and 50'],
    ['--context', 'Infinity', '0 and 50'],
    ['--context', '-1', '0 and 50'],
    ['--context', '51', '0 and 50'],
    ['--max-cards', 'NaN', '0 and 100'],
    ['--max-cards', '2.5', '0 and 100'],
    ['--max-cards', '-1', '0 and 100'],
    ['--max-cards', '101', '0 and 100'],
  ] as const) {
    assert.throws(
      () => parseArgs(['split', 'ci.log', flag, value]),
      new RegExp(`${flag} must be an integer between ${range}`),
    );
  }
});

test('parseArgs rejects empty numeric option values', () => {
  assert.throws(
    () => parseArgs(['split', 'ci.log', '--context=']),
    /--context must be an integer between 0 and 50/,
  );
  assert.throws(
    () => parseArgs(['split', 'ci.log', '--max-cards=']),
    /--max-cards must be an integer between 0 and 100/,
  );
});
