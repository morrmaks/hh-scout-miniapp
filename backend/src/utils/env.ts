import process from 'node:process';

const isDev = process.env.NODE_ENV !== 'production';

interface Options {
  optional?: boolean;
}

export function getEnv(key: string): string;
export function getEnv(key: string, options: { optional: true }): string | undefined;

// implementation
export function getEnv(key: string, options?: Options) {
  const value = process.env[key];

  if (value !== undefined) return value;

  if (options?.optional) {
    if (isDev) throw new Error(`Переменная окружения ${key} не задана`);
    return undefined;
  }

  throw new Error(`Переменная окружения ${key} не задана`);
}