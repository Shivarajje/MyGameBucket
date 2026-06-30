export type Game = {
  id: string;
  igdbId: number;
  slug: string;
  title: string;
  coverUrl: string | null;
  genre: string | null;
  platform: string | null;
  releaseYear: number | null;
  developer: string | null;
  summary: string | null;
  lastSyncedAt: string;
  createdAt: string;
};

export type GameSearchResult = {
  igdbId: number;
  slug: string;
  title: string;
  coverUrl: string | null;
  genre: string | null;
  platform: string | null;
  releaseYear: number | null;
};

export type GameDetail = Game & {
  screenshots?: string[];
};
