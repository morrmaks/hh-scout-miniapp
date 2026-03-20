export const ROUTES = {
  MAIN: '/',
  JOB: (id: string) => `/job/${id}`,
  FAVORITES: '/favorites',
  SETTINGS: {
    MAIN: '/settings',
    THEME: '/settings/theme',
    RESUMES: '/settings/resumes'
  }
};
