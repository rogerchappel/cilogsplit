const REDACTIONS: Array<[RegExp, string]> = [
  [/gh[pousr]_[A-Za-z0-9_]{20,}/g, 'gh_***'],
  [/(?:github|npm|slack|api|access|secret|token|password|passwd|pwd)[_-]?(?:token|key|secret|password)?\s*[=:]\s*[^\s'\"]+/gi, '$1=***'],
  [/AKIA[0-9A-Z]{16}/g, 'AKIA***'],
  [/[A-Za-z0-9+/]{32,}={0,2}/g, value => (looksSecret(value) ? '***redacted***' : value)],
];

export function redactText(text: string): string {
  let output = text;
  for (const [regex, replacement] of REDACTIONS) {
    output = output.replace(regex, replacement as string);
  }
  return output;
}

export function redactLines(lines: string[]): string[] {
  return lines.map(redactText);
}

function looksSecret(value: string): boolean {
  if (value.length < 32) return false;
  const unique = new Set(value).size;
  return unique > 12 && !/^\d+$/.test(value);
}
