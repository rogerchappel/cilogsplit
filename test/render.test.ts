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
