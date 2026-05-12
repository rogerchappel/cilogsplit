# cilogsplit

`cilogsplit` is a local-first TypeScript CLI that turns noisy CI logs into small failure cards, summaries, and copy-ready agent prompts.

It is a log machete for the jungle: deterministic, offline, and boring in the best way.

## Install

```sh
npm install -g cilogsplit
```

For local development from this repository:

```sh
npm install
npm run build
node dist/src/cli.js --help
```

## Usage

Split a saved log into terminal cards:

```sh
cilogsplit split ./ci.log
```

Read from stdin and render Markdown:

```sh
cat ./ci.log | cilogsplit split - --format markdown
```

Print a compact summary:

```sh
cilogsplit summarize ./ci.log --format json
```

Generate copy-ready prompts for debugging agents:

```sh
cilogsplit prompt ./ci.log --context 8 --max-cards 3
```

## What it detects today

- Node test failures and assertion errors
- TypeScript compiler diagnostics
- Missing commands and filesystem `ENOENT` failures
- npm/pnpm/yarn dependency install failures
- Permission and GitHub token scope failures
- Python traceback and pytest-style failures
- GitHub Actions error annotations

## Safety and privacy

- No network calls. No telemetry. No CI provider API access.
- Reads only stdin or a local file path you pass in.
- Redacts common GitHub tokens, API/token assignments, AWS access keys, and high-entropy secret-like strings before rendering.
- Use `--no-redact` only for private local inspection.

## Verification

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Library API

```ts
import { splitLog } from 'cilogsplit';

const result = splitLog(logText, 'ci.log', { contextLines: 6, maxCards: 5 });
console.log(result.summary.headline);
```

## Project status

MVP. Useful for local triage and agent handoff; not a full observability product.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, verified, and local-first.

## Security

See [SECURITY.md](SECURITY.md). Please never paste secrets into public issues.

## License

MIT
