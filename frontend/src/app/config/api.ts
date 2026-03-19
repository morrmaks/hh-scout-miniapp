export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) console.warn('VITE_API_URL is not defined');

console.info('API_URL:', API_URL);
console.info('MODE:', import.meta.env.MODE);
