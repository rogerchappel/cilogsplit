# Security Policy

## Supported Versions

`cilogsplit` is pre-1.0. Security fixes are made on the default branch until versioned releases begin.

| Version | Supported |
| --- | --- |
| `main` | Yes |
| `< 0.1.0` | No public support commitment |

## Local-first posture

`cilogsplit` is designed to be safe for sensitive CI logs:

- It reads only stdin or a local file path explicitly provided by the user.
- It does not call network services or CI provider APIs.
- It does not include telemetry.
- It redacts common token and secret-like values by default before rendering output.

Redaction is a safety net, not a guarantee. Review output before sharing it outside your machine.

## Reporting a Vulnerability

Please do not report suspected vulnerabilities in public issues, pull requests, or discussions.

Ask maintainers for a private security reporting path before sharing details. If no private reporting path exists yet, ask through public project channels without including exploit details, secrets, personal data, or sensitive technical details.

## What to Include

When a private reporting path is available, include:

- A clear description of the issue.
- Affected versions, files, packages, workflows, or configuration.
- Safe reproduction steps or a minimal proof of concept.
- Potential impact.
- Suggested mitigation, if known.

## Disclosure

Coordinate disclosure with maintainers before publishing vulnerability details.
