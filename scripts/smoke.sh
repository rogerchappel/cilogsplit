#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

node dist/src/cli.js split fixtures/node-failure.log --format text --context 2 | grep -q "Node test failure"
node dist/src/cli.js summarize fixtures/typescript-failure.log --format json | grep -q '"totalCards"'
node dist/src/cli.js prompt fixtures/install-failure.log | grep -q "smallest fix"
cat fixtures/permission-failure.log | node dist/src/cli.js split - --format markdown | grep -q "Permission failure"
node dist/src/cli.js --format json fixtures/typescript-failure.log | grep -q '"totalCards"'
node dist/src/cli.js split --help | grep -q "Usage:"
node dist/src/cli.js split fixtures/node-failure.log --help | grep -q "Usage:"
node dist/src/cli.js split --version | grep -q '^0.1.0$'
unknown_output="$(node dist/src/cli.js --bogus 2>&1 || true)"
if grep -q "ENOENT" <<<"$unknown_output"; then
  echo "unknown options must not be treated as filenames" >&2
  exit 1
fi
grep -q "Unknown option: --bogus" <<<"$unknown_output"

printf 'smoke ok\n'
