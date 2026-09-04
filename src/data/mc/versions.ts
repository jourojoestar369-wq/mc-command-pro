export const VERSION_GROUPS: { group: string; versions: string[] }[] = [
  { group: "Modern — 1.13+", versions: ["1.21", "1.20", "1.19", "1.18", "1.17", "1.16", "1.15", "1.14", "1.13"] },
  { group: "Legacy — 1.12-", versions: ["1.12", "1.11", "1.10", "1.9", "1.8"] },
];

export function isLegacyVersion(version: string): boolean {
  const major = parseFloat(version);
  return Number.isFinite(major) && major < 1.13;
}

export const DEFAULT_VERSION = "1.21";