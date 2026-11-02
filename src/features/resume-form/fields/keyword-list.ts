export function addKeywords(
  current: readonly string[],
  candidates: readonly string[],
): string[] {
  const next = [...current];
  const seen = new Set(current.map((keyword) => keyword.toLowerCase()));
  for (const candidate of candidates) {
    const keyword = candidate.trim();
    const key = keyword.toLowerCase();
    if (keyword !== "" && !seen.has(key)) {
      next.push(keyword);
      seen.add(key);
    }
  }
  return next;
}
