import assert from 'node:assert/strict';
import test from 'node:test';
import { renderJson, renderMarkdown, renderText } from '../src/render.js';
import { splitLog } from '../src/split.js';

test('renderers include useful card details', () => {
  const result = splitLog('not ok 1 - fails\nAssertionError [ERR_ASSERTION]: nope', 'inline');
  assert.match(renderText(result), /card-1/);
  assert.match(renderMarkdown(result), /Agent prompt/);
  assert.equal(JSON.parse(renderJson(result)).cards[0].id, 'card-1');
});

test('markdown renderer preserves ordinary excerpt and prompt fences', () => {
  const result = splitLog('AssertionError: nope', 'inline');
  const markdown = renderMarkdown(result);

  assert.match(markdown, /```text\n1: AssertionError: nope\n```/);
  assert.match(markdown, /````text\nYou are debugging a CI failure card/);
});

test('markdown renderer lengthens excerpt fences around backtick runs', () => {
  const result = splitLog('AssertionError: docs build failed\n```text\nrendered diagnostic\n````', 'inline');
  const markdown = renderMarkdown(result);

  assert.match(markdown, /`````text\n1: AssertionError: docs build failed\n2: ```text\n3: rendered diagnostic\n4: ````\n`````/);
});

test('markdown renderer lengthens Agent prompt fences around backtick runs', () => {
  const result = splitLog('AssertionError: docs build failed\n`````text\nrendered diagnostic\n`````', 'inline');
  const markdown = renderMarkdown(result);

  assert.match(markdown, /``````text\nYou are debugging a CI failure card[\s\S]*2: `````text[\s\S]*4: `````[\s\S]*\n``````\n\n<\/details>/);
});
