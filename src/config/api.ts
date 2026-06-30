export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    SESSION: '/api/auth/session',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  GAMES: {
    SEARCH: '/api/games/search',
    DETAIL: (slug: string) => `/api/games/${slug}`,
    MANUAL_SUBMIT: '/api/games/manual',
  },
  LIBRARY: {
    BASE: '/api/library',
    DETAIL: (id: string) => `/api/library/${id}`,
    STATS: '/api/library/stats',
  },
  PROFILES: {
    ME: '/api/profiles/me',
    PUBLIC: (username: string) => `/api/profiles/${username}`,
    AVATAR: '/api/profiles/me/avatar',
    PINNED: '/api/profiles/me/pinned',
    STATS: '/api/profiles/me/stats',
  },
  JOURNAL: {
    BASE: '/api/journal',
    DETAIL: (id: string) => `/api/journal/${id}`,
    GAME: (gameId: string) => `/api/journal/game/${gameId}`,
  },
  COLLECTIONS: {
    BASE: '/api/collections',
    DETAIL: (id: string) => `/api/collections/${id}`,
    GAMES: (id: string) => `/api/collections/${id}/games`,
  },
  SEARCH: {
    USERS: '/api/search/users',
    GAMES: '/api/search/games',
  },
  SETTINGS: '/api/settings',
  ADMIN: {
    STATS: '/api/admin/stats',
    USERS: '/api/admin/users',
    USER_DETAIL: (id: string) => `/api/admin/users/${id}`,
    GAMES_QUEUE: '/api/admin/games/queue',
    GAME_APPROVE: (id: string) => `/api/admin/games/queue/${id}`,
    SYSTEM_LOGS: '/api/admin/logs/system',
    ADMIN_LOGS: '/api/admin/logs/admin',
    MODERATE: '/api/admin/moderate',
  }
};
