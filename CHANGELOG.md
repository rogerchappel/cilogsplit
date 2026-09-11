# Changelog

All notable changes to this project will be documented in this file.

This project follows the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
format and uses semantic versioning when versioned releases are published.

## [Unreleased]

### Added

- Initial local-first TypeScript CLI with `split`, `summarize`, and `prompt` commands.
- Built-in failure patterns for Node, TypeScript, dependency, permission, Python, and GitHub Actions failures.
- Fixture-backed tests, smoke script, and validation workflow.
- Safety docs for offline operation and default redaction.
- Package smoke verification now checks the CLI bin target, tutorial docs,
  examples, package metadata, and npm files allowlist before the dry-run pack.

### Fixed

- Default redaction no longer erases ordinary CI data: hex commit SHAs,
  `sha256:`/`sha512-` checksums, npm `integrity` digests, and long workspace
  file paths now survive `redactText` unchanged, so FAIL lines and their
  identifiers reach rendered cards intact. GitHub `gh[pousr]_` tokens, AWS
  access key ids, secret-looking assignments, and unlabelled high-entropy
  base64 secrets remain masked, and assignment masking now preserves the
  original `:`/`=` separator instead of rewriting it to `=`.
- ANSI color and presentation controls no longer hide anchored failure markers
  during classification; original log text and line numbers remain intact.
- `--context`/`--max-cards` (and `-c`/`-m`, plus `--flag=value` forms) now
  reject non-canonical decimal spellings such as `2.0`, `1e1`, `0x10`, `0b101`,
  or `0o17` with the documented integer error instead of silently coercing them;
  regression tests cover the rejected forms and the CLI's nonzero exit code.

## Release Links

- Unreleased:
  `https://github.com/rogerchappel/cilogsplit/commits/main`
- Latest release:
  `https://github.com/rogerchappel/cilogsplit/releases/latest`

Replace placeholder links once the first release tag exists.
