export async function fetchRetry(url: string, retries = 3, options: RequestInit = {}) {
  for (let i = 0; i < retries; i++) {
    let timeout: NodeJS.Timeout | undefined;
    const delay = 500 * 2 ** i;

    try {
      const controller = new AbortController();

      timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'HH-User-Agent': 'hh-scout-miniapp/1.0 (dev@example.com)',
          'User-Agent': 'hh-scout-miniapp/1.0',
          ...(options.headers || {})
        }
      });

      clearTimeout(timeout);

      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) {
        throw new Error(`HH API error ${res.status}`);
      }

      return res;
    } catch (err) {
      if (timeout) clearTimeout(timeout);

      if (i === retries - 1) throw err;

      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw new Error('HH request failed');
}
