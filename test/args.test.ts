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

test('parseArgs accepts options before an implicit logfile', () => {
  const args = parseArgs(['--format', 'json', '--context=3', 'ci.log']);
  assert.equal(args.command, 'split');
  assert.equal(args.file, 'ci.log');
  assert.equal(args.format, 'json');
  assert.equal(args.contextLines, 3);
});

test('parseArgs accepts options before an explicit command', () => {
  const args = parseArgs(['--format', 'json', 'summarize', 'ci.log']);
  assert.equal(args.command, 'summarize');
  assert.equal(args.file, 'ci.log');
  assert.equal(args.format, 'json');
});

test('parseArgs rejects unknown option-like tokens directly', () => {
  assert.throws(() => parseArgs(['--bogus']), /Unknown option: --bogus\. Run cilogsplit --help for usage\./);
  assert.throws(() => parseArgs(['split', 'ci.log', '-x']), /Unknown option: -x/);
});

test('parseArgs treats help flags as global but help as a command', () => {
  assert.equal(parseArgs(['split', '--help']).command, 'help');
  assert.equal(parseArgs(['split', 'ci.log', '--help']).command, 'help');
  assert.equal(parseArgs(['help']).command, 'help');
});

test('parseArgs treats version flags as global and version as a command only', () => {
  assert.equal(parseArgs(['split', '--version']).command, 'version');
  assert.equal(parseArgs(['split', 'ci.log', '-v']).command, 'version');
  assert.equal(parseArgs(['version']).command, 'version');
  assert.equal(parseArgs(['split', 'version']).file, 'version');
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

test('parseArgs rejects non-decimal spellings of numeric options', () => {
  const rejectedForms = ['2.0', '1e1', '0x10', '0b101', '0o17', '1_0', '+5'];
  for (const flag of ['--context', '--max-cards']) {
    for (const value of rejectedForms) {
      assert.throws(
        () => parseArgs(['split', 'ci.log', flag, value]),
        new RegExp(`${flag} must be an integer between `),
        `${flag} ${value} must be rejected`,
      );
    }
  }
});

test('parseArgs rejects non-decimal spellings in --flag=value form', () => {
  const rejectedForms: Array<[token: string, flag: string]> = [
    ['--context=2.0', '--context'],
    ['--context=1e1', '--context'],
    ['--context=0x10', '--context'],
    ['--context=0b101', '--context'],
    ['--max-cards=2.0', '--max-cards'],
    ['--max-cards=1e1', '--max-cards'],
    ['--max-cards=0x10', '--max-cards'],
    ['--max-cards=0b101', '--max-cards'],
  ];
  for (const [token, flag] of rejectedForms) {
    assert.throws(
      () => parseArgs(['split', 'ci.log', token]),
      new RegExp(`${flag} must be an integer between `),
      `${token} must be rejected`,
    );
  }
});

test('parseArgs rejects non-decimal spellings with short flags -c and -m', () => {
  assert.throws(
    () => parseArgs(['split', 'ci.log', '-c', '2.0']),
    /--context must be an integer between 0 and 50/,
  );
  assert.throws(
    () => parseArgs(['split', 'ci.log', '-c', '0x10']),
    /--context must be an integer between 0 and 50/,
  );
  assert.throws(
    () => parseArgs(['split', 'ci.log', '-m', '1e1']),
    /--max-cards must be an integer between 0 and 100/,
  );
  assert.throws(
    () => parseArgs(['split', 'ci.log', '-m', '0b101']),
    /--max-cards must be an integer between 0 and 100/,
  );
});

test('parseArgs still accepts plain decimal integers in range', () => {
  const shortForms = parseArgs(['split', 'ci.log', '-c', '10', '-m', '20']);
  assert.equal(shortForms.contextLines, 10);
  assert.equal(shortForms.maxCards, 20);

  const equalsForms = parseArgs(['split', 'ci.log', '--context=10', '--max-cards=40']);
  assert.equal(equalsForms.contextLines, 10);
  assert.equal(equalsForms.maxCards, 40);
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
