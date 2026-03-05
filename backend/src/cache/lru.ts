type CacheEntry<V> = {
  value: V
  expires: number
}

export class LRU<K, V> {
  private cache = new Map<K, CacheEntry<V>>()

  constructor(
    private max = 500,
    private ttl = 10 * 60 * 1000
  ) {}

  get(key: K): V | undefined {
    const entry = this.cache.get(key)

    if (!entry) return

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return
    }

    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.value
  }

  set(key: K, value: V) {
    if (this.cache.has(key))
      this.cache.delete(key)

    this.cache.set(key, {
      value,
      expires: Date.now() + this.ttl
    })

    if (this.cache.size > this.max) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined)
        this.cache.delete(firstKey)
    }
  }

  cleanup() {
    const now = Date.now()

    for (const [key, entry] of this.cache) {
      if (entry.expires < now)
        this.cache.delete(key)
    }
  }

  size() {
    return this.cache.size
  }
}