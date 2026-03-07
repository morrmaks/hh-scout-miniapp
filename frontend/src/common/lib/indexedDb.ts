const DB_NAME = 'app-db';
const STORE = 'kv';
const VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

export async function dbGet<T>(key: string): Promise<T | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);

    const req = store.get(key);

    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbSet<T>(key: string, value: T) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);

    const req = store.put(value, key);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(key: string) {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);

    const req = store.delete(key);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
