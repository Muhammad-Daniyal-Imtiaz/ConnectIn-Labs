interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  tags: string[];
}

const store = new Map<string, CacheEntry<unknown>>();

function cacheKey(raw: string): string {
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
    hash |= 0;
  }
  return `ck_${hash}_${raw.length}`;
}

export async function getCached<T>(
  key: string,
  tags: string | string[],
  fetchFn: () => Promise<T>,
  ttl: number = 60_000,
): Promise<T> {
  const k = cacheKey(key);
  const tagArr = Array.isArray(tags) ? tags : [tags];
  const now = Date.now();

  const existing = store.get(k) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > now) {
    return existing.data;
  }

  const data = await fetchFn();

  store.set(k, {
    data,
    expiresAt: now + ttl,
    tags: tagArr,
  });

  return data;
}

export function invalidateCache(...tags: string[]): void {
  if (tags.length === 0) return;
  const set = new Set(tags);
  for (const [key, entry] of store.entries()) {
    if (entry.tags.some((t) => set.has(t))) {
      store.delete(key);
    }
  }
}

export function clearAllCaches(): void {
  store.clear();
}
