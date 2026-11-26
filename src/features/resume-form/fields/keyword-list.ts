import { KEYWORD_SEPARATOR } from "#/features/resume-form/constants";

function keywordKey(keyword: string): string {
  return keyword.toLowerCase();
}

export function addKeywords(
  current: readonly string[],
  candidates: readonly string[],
): string[] {
  const next = [...current];
  const seen = new Set(current.map(keywordKey));
  for (const candidate of candidates) {
    const keyword = candidate.trim();
    const key = keywordKey(keyword);
    if (keyword !== "" && !seen.has(key)) {
      next.push(keyword);
      seen.add(key);
    }
  }
  return next;
}

// An edit can split into several keywords, merge into an existing one or
// clear the keyword; `count` is how many keywords now stand at `index`.
export function replaceKeyword(
  current: readonly string[],
  index: number,
  text: string,
): { items: string[]; count: number } {
  const others = current.filter((_, itemIndex) => itemIndex !== index);
  const added = addKeywords(others, text.split(KEYWORD_SEPARATOR)).slice(
    others.length,
  );
  return {
    items: [...others.slice(0, index), ...added, ...others.slice(index)],
    count: added.length,
  };
}
