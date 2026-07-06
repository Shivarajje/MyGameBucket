import { IGDB_CONFIG, IGDB_CACHE } from '@/config/igdb';
import { GameSearchResult, GameDetail } from '@/types/game';
import { mapIgdbGenreToCategory } from '@/lib/genre-mapper';

let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (accessToken && tokenExpiryTime > now + IGDB_CACHE.TOKEN_EXPIRY_BUFFER) {
    return accessToken;
  }

  const url = `${IGDB_CONFIG.AUTH_URL}?client_id=${IGDB_CONFIG.CLIENT_ID}&client_secret=${IGDB_CONFIG.CLIENT_SECRET}&grant_type=client_credentials`;

  const response = await fetch(url, { method: 'POST', next: { revalidate: 0 } });

  if (!response.ok) {
    throw new Error('Failed to fetch IGDB access token');
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiryTime = now + data.expires_in;

  return accessToken!;
}

async function igdbRequest(endpoint: string, query: string) {
  const token = await getAccessToken();

  const response = await fetch(`${IGDB_CONFIG.API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': IGDB_CONFIG.CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'text/plain',
    },
    body: query,
    // IGDB responses change, cache at Next.js fetch level (e.g., 1 hour for search, 1 day for details)
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    console.error('IGDB API Error:', await response.text());
    throw new Error(`IGDB API error: ${response.status}`);
  }

  return response.json();
}

const EXCLUDE_KEYWORDS = [
  'deluxe', 'collector', 'launch', 'premium', 'bundle', 'pack', 'package',
  'goty', 'game of the year', 'anniversary', 'definitive',
  'director\'s cut', 'directors cut', 'ultimate', 'season pass',
  'special edition', 'limited edition', 'legendary edition',
  'digital deluxe', 'complete edition', 'gold edition'
];

export const externalGameApi = {
  async searchGames(query: string, limit = 10): Promise<GameSearchResult[]> {
    if (!query) return [];

    // Request a larger pool (50) so we can filter out duplicate editions in JS
    const igdbQuery = `
      search "${query}";
      fields id, name, slug, cover.image_id, genres.name, platforms.name, first_release_date, game_type;
      where game_type = (0, 4, 8, 9, 10);
      limit 50;
    `;

    const results = await igdbRequest(IGDB_CONFIG.ENDPOINTS.GAMES, igdbQuery);

    // Only exclude keywords if they are not part of the user's explicit query
    const lowerQuery = query.toLowerCase();
    const activeExclusions = EXCLUDE_KEYWORDS.filter(keyword => !lowerQuery.includes(keyword));

    const filtered = results.filter((igdbGame: any) => {
      const lowerName = igdbGame.name.toLowerCase();
      return !activeExclusions.some(keyword => lowerName.includes(keyword));
    });

    return filtered.slice(0, limit).map(formatIgdbGameToSearchResult);
  },

  async getGameBySlug(slug: string): Promise<GameDetail | null> {
    const igdbQuery = `
      fields id, name, slug, cover.image_id, genres.name, platforms.name, first_release_date, involved_companies.company.name, involved_companies.developer, summary, screenshots.image_id;
      where slug = "${slug}";
      limit 1;
    `;

    const results = await igdbRequest(IGDB_CONFIG.ENDPOINTS.GAMES, igdbQuery);

    if (!results || results.length === 0) {
      return null;
    }

    return formatIgdbGameToDetail(results[0]);
  },

  async getPopularGames(limit = 10): Promise<GameSearchResult[]> {
    // Request a larger pool (50) so we can filter out duplicate editions in JS
    const igdbQuery = `
      fields id, name, slug, cover.image_id, genres.name, platforms.name, first_release_date, game_type;
      where rating_count > 50 & version_parent = null & game_type = (0, 4, 8, 9, 10);
      sort rating_count desc;
      limit 50;
    `;

    const results = await igdbRequest(IGDB_CONFIG.ENDPOINTS.GAMES, igdbQuery);

    const filtered = results.filter((igdbGame: any) => {
      const lowerName = igdbGame.name.toLowerCase();
      return !EXCLUDE_KEYWORDS.some(keyword => lowerName.includes(keyword));
    });

    return filtered.slice(0, limit).map(formatIgdbGameToSearchResult);
  }
};

// --- Formatters ---

function formatIgdbGameToSearchResult(igdbGame: any): GameSearchResult {
  const coverUrl = igdbGame.cover?.image_id
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${igdbGame.cover.image_id}.jpg`
    : null;

  const genre = igdbGame.genres && igdbGame.genres.length > 0
    ? igdbGame.genres.slice(0, 4).map((g: any) => g.name).join(', ')
    : null;

  const platform = igdbGame.platforms && igdbGame.platforms.length > 0
    ? igdbGame.platforms.map((p: any) => p.name).join(', ')
    : null;

  const releaseYear = igdbGame.first_release_date
    ? new Date(igdbGame.first_release_date * 1000).getFullYear()
    : null;

  return {
    igdbId: igdbGame.id,
    slug: igdbGame.slug,
    title: igdbGame.name,
    coverUrl,
    genre,
    platform,
    releaseYear,
  };
}

function formatIgdbGameToDetail(igdbGame: any): GameDetail {
  const searchResult = formatIgdbGameToSearchResult(igdbGame);

  const developerCompany = igdbGame.involved_companies?.find((ic: any) => ic.developer);
  const developer = developerCompany ? developerCompany.company.name : null;

  const screenshots = igdbGame.screenshots
    ? igdbGame.screenshots.map((s: any) => `https://images.igdb.com/igdb/image/upload/t_1080p/${s.image_id}.jpg`).slice(0, 5)
    : [];

  return {
    id: '', // This will be the UUID from our local game_catalog once synced
    igdbId: searchResult.igdbId,
    slug: searchResult.slug,
    title: searchResult.title,
    coverUrl: searchResult.coverUrl,
    genre: searchResult.genre,
    platform: searchResult.platform,
    releaseYear: searchResult.releaseYear,
    developer,
    summary: igdbGame.summary || null,
    lastSyncedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    screenshots,
  };
}
