import { HTTPS_PREFIX } from "#/features/resume-form/constants";

const HAS_SCHEME = /^[a-z][a-z\d+.-]*:/i;
const LOOKS_LIKE_DOMAIN = /^[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/;

export function withHttps(value: string): string {
  const trimmed = value.trim();
  if (HAS_SCHEME.test(trimmed) || !LOOKS_LIKE_DOMAIN.test(trimmed)) {
    return value;
  }
  return `${HTTPS_PREFIX}${trimmed}`;
}
