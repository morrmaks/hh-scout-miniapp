import fetches from '@siberiacancode/fetches';

export const api = fetches.create({
  baseURL: import.meta.env.VITE_API_URL
});
