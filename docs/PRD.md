# cilogsplit PRD

Status: in-progress

## Summary

`cilogsplit` turns a giant CI log into small, labeled failure cards with nearby context, likely root-cause hints, and copy-ready agent prompts. It is a log machete for the jungle. 🌿

## Problem

CI logs are noisy and long. Humans and agents waste time scrolling through installation noise, repeated warnings, and downstream failures caused by one earlier error.

## Users

- Developers triaging failed GitHub Actions or local build logs.
- Agents that need compact failure context instead of 20,000-line logs.
- Maintainers preparing bug reports from CI output.

## Goals

- Split logs into phases and failure cards.
- Detect common Node/Python/GitHub Actions failure patterns.
- Preserve line ranges and source snippets around errors.
- Render Markdown, JSON, and concise terminal output.
- Work entirely offline from pasted or saved logs.

## Non-goals

- Calling CI provider APIs.
- AI summarization in V1.
- Replacing full observability tools.

## V1 requirements

- TypeScript CLI commands: `split`, `summarize`, `prompt`.
- Pattern library for test failures, type errors, missing commands, dependency failures, and permission errors.
- Context window controls and max-card limits.
- Fixture logs with expected snapshots.
- Tests for parser, classifier, grouping, and renderers.

## Safety

- Local file/stdin only.
- Redact common tokens and secret-like values in rendered output.
- Never sends logs anywhere.

## Attribution

Inspired by build log analyzers, error folding, and agent debugging prompts; renamed and scoped as a deterministic local CLI.
