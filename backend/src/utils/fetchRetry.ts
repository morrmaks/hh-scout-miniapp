export async function fetchRetry(url: string, retries = 3, options: RequestInit = {}) {
  for (let i = 0; i < retries; i++) {
    let timeout: NodeJS.Timeout | undefined;
    const delay = 500 * 2 ** i;

    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }

      if (!res.ok) {
        let body: any;

        try {
          body = await res.json();
        } catch {
          body = await res.text();
        }

        const error = new Error(`HH API error ${res.status}`);
        (error as any).status = res.status;
        (error as any).hh = body;

        throw error;
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
