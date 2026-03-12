const pending = new Map<string, Set<string>>();

export async function optimistic<T>({
  scope = 'default',
  key,
  apply,
  rollback,
  run
}: {
  scope?: string;
  key?: string;
  apply: () => void;
  rollback: () => void;
  run: () => Promise<T>;
}): Promise<T | undefined> {
  if (key) {
    if (!pending.has(scope)) pending.set(scope, new Set());

    const scopePending = pending.get(scope)!;
    if (scopePending.has(key)) return;

    scopePending.add(key);
  }

  apply();

  try {
    return await run();
  } catch (e) {
    rollback();
    throw e;
  } finally {
    if (key) {
      pending.get(scope)?.delete(key);
    }
  }
}

export function isPending(scope: string, key: string) {
  return pending.get(scope)?.has(key) ?? false;
}
