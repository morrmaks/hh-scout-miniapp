const pending = new Map<string, Set<string>>();

interface OptimisticType<T> {
  key?: string;
  scope?: string;
  apply: () => void;
  rollback: () => void;
  run: () => Promise<T>;
}

export async function optimistic<T>({
  scope = 'default',
  key,
  apply,
  rollback,
  run
}: OptimisticType<T>): Promise<T | undefined> {
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
    if (key) pending.get(scope)?.delete(key);
  }
}

export function isPending(scope: string, key: string) {
  return pending.get(scope)?.has(key) ?? false;
}
