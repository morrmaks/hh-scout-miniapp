export async function fetchRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
        continue;
      }

      if (!res.ok) throw new Error('HH error');
      return res;
    } catch {
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }

  throw new Error('HH request failed');
}
