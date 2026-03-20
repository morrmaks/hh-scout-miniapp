const MAX_CONCURRENT = 3;

let active = 0;

const queue: Array<() => Promise<void>> = [];

function process() {
  while (active < MAX_CONCURRENT && queue.length) {
    const task = queue.shift();
    if (!task) return;

    active++;

    Promise.resolve(task())
      .catch(() => {})
      .finally(() => {
        active--;
        process();
      });
  }
}

export function enqueue<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });

    process();
  });
}
