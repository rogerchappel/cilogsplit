# Social Hooks

Grounded post drafts for the GitHub Actions triage demo.

## Hooks

1. CI logs are easier to hand off when the failure is split into cards instead of pasted as a wall of text.
2. `cilogsplit` reads a saved GitHub Actions log locally and emits Markdown cards, JSON summaries, or a copy-ready debugging prompt.
3. The demo uses `examples/github-actions.log`, so anyone can run `bash demo/run-github-actions-triage.sh` without a CI token.
4. Agent handoff improves when the prompt includes the top failure cards and nearby log context, not the whole run.

## Clip Outline

- Open `examples/github-actions.log`.
- Run `bash demo/run-github-actions-triage.sh`.
- Show `.tmp/demo-github-actions-triage/failure-cards.md`.
- Show the JSON summary for automation.
- Close on the generated agent prompt.

## Guardrails

- Do not claim complete root-cause analysis.
- Do not paste real secrets or private CI logs into public examples.
- Keep the message on local triage, redaction, and handoff artifacts.
