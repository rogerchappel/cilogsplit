# Triage A GitHub Actions Log

This walkthrough uses `examples/github-actions.log` to show how `cilogsplit` turns a saved CI log into small artifacts for maintainers and debugging agents.

## 1. Run The Demo

```sh
npm install
bash demo/run-github-actions-triage.sh
```

The demo writes:

- `.tmp/demo-github-actions-triage/failure-cards.md`
- `.tmp/demo-github-actions-triage/summary.json`
- `.tmp/demo-github-actions-triage/agent-prompt.md`

## 2. Start With Failure Cards

Use the Markdown cards when a reviewer needs a compact, copyable view of the failing command, nearby context, and detected failure type.

## 3. Hand JSON To Automation

The summary output is the stable artifact for scripts. Store it with a CI run or pass it to a workflow step that decides whether to open a debugging task.

## 4. Create A Debugging Prompt

The prompt command keeps the top cards and surrounding context together so an agent can begin with the relevant failure instead of reading the whole log.

## Boundaries

- `cilogsplit` reads local files or stdin; it does not call a CI provider API.
- Redaction is pattern-based and should not replace secret hygiene.
- Failure cards are triage hints, not a root-cause guarantee.
