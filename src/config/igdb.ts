export const IGDB_CONFIG = {
  CLIENT_ID: process.env.IGDB_CLIENT_ID || '',
  CLIENT_SECRET: process.env.IGDB_CLIENT_SECRET || '',
  AUTH_URL: 'https://id.twitch.tv/oauth2/token',
  API_URL: 'https://api.igdb.com/v4',
  ENDPOINTS: {
    GAMES: '/games',
  }
};

export const IGDB_CACHE = {
  TOKEN_EXPIRY_BUFFER: 300, // Refresh token 5 minutes before actual expiry
};
