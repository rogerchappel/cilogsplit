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

`--context` accepts integers from 0 to 50 and controls the lines included
on each side of a detected failure. `--max-cards` accepts integers from 0
to 100; use 0 to suppress card generation. Invalid, fractional, or
out-of-range values exit with an error.

Run the bundled GitHub Actions triage demo:

```sh
bash demo/run-github-actions-triage.sh
```

It writes Markdown cards, a JSON summary, and an agent prompt under `.tmp/demo-github-actions-triage/`. See [docs/tutorials/github-actions-triage.md](docs/tutorials/github-actions-triage.md) for the walkthrough.

## What it detects today

- Node test failures and assertion errors
- TypeScript compiler diagnostics
- Missing commands and filesystem `ENOENT` failures
- npm/pnpm/yarn dependency install failures
- Permission and GitHub token scope failures
- Python traceback and pytest-style failures
- GitHub Actions error annotations

Terminal color and presentation controls are ignored while matching these
signals. Rendered cards still retain the original log text and line numbers.

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
npm run package:smoke
npm run release:check
bash scripts/validate.sh
```

## Library API

```ts
import { splitLog, splitLogLines } from 'cilogsplit';

const result = splitLog(logText, 'ci.log', { contextLines: 6, maxCards: 5 });
const sameResult = splitLogLines(logText.split('\n'), 'ci.log', { contextLines: 6, maxCards: 5 });
console.log(result.summary.headline);
```

Both input APIs redact recognized secrets by default, including in failure hits,
excerpts, and generated prompts. Pass `{ redact: false }` only when the returned
data will remain in a trusted local context. `splitLog` and `splitLogLines` apply
the same redaction option and produce equivalent results for equivalent input.

## Project status

MVP. Useful for local triage and agent handoff; not a full observability product.

## Release readiness

Before opening a release PR, run the package checks that exercise the build, tests, smoke path, and pack manifest:

```sh
npm run check
npm test
npm run smoke
npm run package:smoke
npm run release:check
```

`npm run package:smoke` builds the CLI, verifies the published `cilogsplit` bin
target, confirms tutorial docs and examples are present in the package
allowlist, and prints the `npm pack --dry-run` tarball contents.

The package metadata points at the public GitHub repository so npm and generated provenance link back to the source.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep changes small, verified, and local-first.

## Security

See [SECURITY.md](SECURITY.md). Please never paste secrets into public issues.

## License

MIT

## Release verification

Run the same checks locally before opening a release PR:

```bash
npm run check
npm test
npm run build
npm run smoke
npm run package:smoke
npm run release:check
```
