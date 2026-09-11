type Replacement = string | ((substring: string, ...args: any[]) => string);

const REDACTIONS: Array<[RegExp, Replacement]> = [
  [/gh[pousr]_[A-Za-z0-9_]{20,}/g, 'gh_***'],
  [
    /(\b(?:github|npm|slack|api|access|secret|token|password|passwd|pwd)[_-]?(?:token|key|secret|password)?\b)(\s*[=:]\s*)[^\s'"]+/gi,
    '$1$2***',
  ],
  [/AKIA[0-9A-Z]{16}/g, 'AKIA***'],
  [
    /[A-Za-z0-9+/]{32,}={0,2}/g,
    (value: string, offset: number, whole: string) =>
      looksSecret(value, whole.slice(0, offset)) ? '***redacted***' : value,
  ],
];

export function redactText(text: string): string {
  let output = text;
  for (const [regex, replacement] of REDACTIONS) {
    output = typeof replacement === 'string'
      ? output.replace(regex, replacement)
      : output.replace(regex, replacement);
  }
  return output;
}

export function redactLines(lines: string[]): string[] {
  return lines.map(redactText);
}

function looksSecret(value: string, prefix: string): boolean {
  if (value.length < 32) return false;
  // Digests introduced by an algorithm label ("sha256:", "sha512-", npm
  // integrity values, Docker digests) are checksums, not credentials.
  if (/(?:sha|md5|blake2b?)[0-9]*[-_:]$/i.test(prefix)) return false;
  // Hex-only runs are commit SHAs and hex digests.
  if (/^[0-9a-f]+$/i.test(value)) return false;
  // Lowercase path fragments are workspace files, not base64 secrets.
  if (/^[a-z0-9]+(?:\/[a-z0-9]+){2,}$/.test(value)) return false;
  const unique = new Set(value).size;
  return unique > 12 && !/^\d+$/.test(value);
}
