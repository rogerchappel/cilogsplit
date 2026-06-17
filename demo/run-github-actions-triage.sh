#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/.tmp/demo-github-actions-triage"

mkdir -p "$OUT"

npm run build

echo "== Markdown failure cards =="
node "$ROOT/dist/src/cli.js" split "$ROOT/examples/github-actions.log" \
  --format markdown > "$OUT/failure-cards.md"
sed -n '1,60p' "$OUT/failure-cards.md"

echo
echo "== JSON summary =="
node "$ROOT/dist/src/cli.js" summarize "$ROOT/examples/github-actions.log" \
  --format json > "$OUT/summary.json"
node -e "const fs=require('node:fs'); const data=JSON.parse(fs.readFileSync(process.argv[1],'utf8')); console.log(data);" "$OUT/summary.json"

echo
echo "== Agent prompt =="
node "$ROOT/dist/src/cli.js" prompt "$ROOT/examples/github-actions.log" \
  --context 6 \
  --max-cards 2 > "$OUT/agent-prompt.md"
sed -n '1,60p' "$OUT/agent-prompt.md"

grep -Fq 'CI log split' "$OUT/failure-cards.md"
grep -Fq 'totalCards' "$OUT/summary.json"
grep -Fq 'You are debugging a CI failure card' "$OUT/agent-prompt.md"

echo
echo "Demo artifacts written to $OUT"
