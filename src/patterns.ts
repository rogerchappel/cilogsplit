import type { FailurePattern } from './types.js';

export const DEFAULT_PATTERNS: FailurePattern[] = [
  {
    id: 'node-test-fail',
    label: 'Node test failure',
    severity: 'error',
    regex: /(?:not ok|AssertionError|ERR_ASSERTION|Test failed|FAIL\s)/i,
    hint: 'Start with the first failing assertion and inspect the expected vs actual values.',
  },
  {
    id: 'typescript-error',
    label: 'TypeScript compiler error',
    severity: 'error',
    regex: /\berror TS\d{4}:|Type '.*' is not assignable|Cannot find module/i,
    hint: 'Fix the earliest TypeScript diagnostic; later diagnostics may be downstream noise.',
  },
  {
    id: 'missing-command',
    label: 'Missing command or tool',
    severity: 'error',
    regex: /(?:command not found|not recognized as an internal|ENOENT|No such file or directory)/i,
    hint: 'Check install steps, PATH, package scripts, and CI image assumptions.',
  },
  {
    id: 'dependency-install',
    label: 'Dependency install failure',
    severity: 'error',
    regex: /(?:npm ERR!|pnpm ERR!|yarn error|ERESOLVE|Integrity check failed|Could not resolve dependency)/i,
    hint: 'Inspect dependency constraints, lockfile drift, registry access, or package manager version.',
  },
  {
    id: 'permission-denied',
    label: 'Permission failure',
    severity: 'error',
    regex: /(?:EACCES|permission denied|Resource not accessible by integration|403 Forbidden)/i,
    hint: 'Review file permissions, GitHub token scopes, workflow permissions, or branch protections.',
  },
  {
    id: 'python-error',
    label: 'Python failure',
    severity: 'error',
    regex: /(?:Traceback \(most recent call last\)|ModuleNotFoundError|pytest.*failed|FAILED .*::)/i,
    hint: 'Follow the traceback to the first project frame and confirm dependencies are installed.',
  },
  {
    id: 'github-actions-error',
    label: 'GitHub Actions annotation',
    severity: 'error',
    regex: /^::error|Process completed with exit code [1-9]/i,
    hint: 'Look just above the annotation for the command that exited unsuccessfully.',
  },
  {
    id: 'warning',
    label: 'Warning signal',
    severity: 'warning',
    regex: /\bwarn(?:ing)?\b|deprecated/i,
    hint: 'Warnings are included for context; prioritize errors unless this is the only signal.',
  },
];
