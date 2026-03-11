import fetches from '@siberiacancode/fetches';

import { API_URL } from '@/app/config/api';

const instance = fetches.create({
  baseURL: API_URL
});

export { instance };
