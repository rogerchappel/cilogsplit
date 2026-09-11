import assert from 'node:assert/strict';
import test from 'node:test';
import { redactText } from '../src/redact.js';

test('redactText masks GitHub tokens', () => {
  assert.equal(redactText('token ghp_abcdefghijklmnopqrstuvwxyz123456'), 'token gh_***');
});

test('redactText masks key assignments', () => {
  assert.equal(redactText('NPM_TOKEN=abc123'), 'NPM_TOKEN=***');
});

test('redactText preserves hex commit SHAs', () => {
  const line = 'Resolved head 0123456789abcdef0123456789abcdef01234567 from origin/main';
  assert.equal(redactText(line), line);
});

test('redactText preserves sha256 hex checksums', () => {
  const line = 'verify sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 dist/bundle.js';
  assert.equal(redactText(line), line);
});

test('redactText preserves npm integrity digests', () => {
  const line =
    'npm ERR! expected sha512-abcdefghijKLMNOPQRSTUVwxyz0123456789+/abcdefghijKLMNOPQRSTUVwxyz0123456789+/ab== from the registry';
  assert.equal(redactText(line), line);
});

test('redactText preserves long workspace file paths', () => {
  const line = 'FAIL src/deeply/nested/module/file/name/with/long/path/thing.test.ts';
  assert.equal(redactText(line), line);
});

test('redactText masks AWS access key ids', () => {
  assert.equal(redactText('aws access key id AKIAIOSFODNN7EXAMPLE found'), 'aws access key id AKIA*** found');
});

test('redactText masks secret-looking assignments and keeps the original separator', () => {
  assert.equal(redactText('api_token: supersecretvalue123'), 'api_token: ***');
  assert.equal(redactText('NPM_TOKEN=abc123'), 'NPM_TOKEN=***');
});

test('redactText masks unlabelled high-entropy base64 secrets', () => {
  assert.equal(
    redactText('dumped wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEYz'),
    'dumped ***redacted***',
  );
});
