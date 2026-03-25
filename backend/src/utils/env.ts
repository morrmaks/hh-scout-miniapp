import process from 'node:process';

export const getDevEnv = (key: string) => {
  return process.env[key];
};

export const getEnv = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Переменная окружения ${key} не задана`);
  }
  return process.env[key] as string;
};
