import assert from 'node:assert/strict';
import test from 'node:test';
import { redactText } from '../src/redact.js';

test('redactText masks GitHub tokens', () => {
  assert.equal(redactText('token ghp_abcdefghijklmnopqrstuvwxyz123456'), 'token gh_***');
});

test('redactText masks key assignments', () => {
  assert.equal(redactText('NPM_TOKEN=abc123'), 'NPM_TOKEN=***');
});
