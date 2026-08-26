const WINDOW_MS = 3_600_000;
const MAX_REQUESTS = 10;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string, now: number = Date.now()): boolean {
  const previous = hits.get(key) ?? [];
  const recent = previous.filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return true;
}
