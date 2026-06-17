# Examples

Try the bundled examples locally:

```sh
npm run build
node dist/src/cli.js split examples/github-actions.log --format markdown
```

The examples are tiny on purpose so the output is easy to inspect.

For a fuller demo that writes Markdown, JSON, and prompt artifacts, run:

```sh
bash demo/run-github-actions-triage.sh
```

See [docs/tutorials/github-actions-triage.md](../docs/tutorials/github-actions-triage.md) for the walkthrough.
