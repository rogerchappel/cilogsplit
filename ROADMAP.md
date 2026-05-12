# Roadmap

This roadmap describes intended direction, not a binding delivery promise.

## Now

- Keep the MVP deterministic, local-first, and easy to run from npm.
- Improve pattern coverage for common CI failures without adding remote dependencies.
- Keep fixtures small, synthetic, and representative.

## Next

- Add snapshot tests for stable Markdown output.
- Support optional config files for custom patterns.
- Add SARIF/JUnit-aware hints when logs include file and test names.
- Improve grouping so cascading failures collapse under the first root-cause card.

## Later

- Explore shell completion.
- Consider HTML output for pasteable triage reports.
- Consider provider-specific log folding only if it remains offline and deterministic.

## Not Planned

- Telemetry.
- Uploading logs to hosted services.
- AI summarization inside the CLI.
- Replacing CI provider dashboards or observability platforms.
