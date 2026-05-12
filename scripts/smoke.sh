#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

node dist/cli.js split fixtures/node-failure.log --format text --context 2 | grep -q "Node test failure"
node dist/cli.js summarize fixtures/typescript-failure.log --format json | grep -q '"totalCards"'
node dist/cli.js prompt fixtures/install-failure.log | grep -q "smallest fix"
cat fixtures/permission-failure.log | node dist/cli.js split - --format markdown | grep -q "Permission failure"

printf 'smoke ok\n'
