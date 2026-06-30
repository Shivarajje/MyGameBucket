import { GenreCategory } from '../constants/enums';

export type Profile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  favoriteGameId: string | null;
  favoriteGenre: GenreCategory | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicProfile = Profile & {
  stats: {
    totalGames: number;
    completedGames: number;
    totalHours: number;
  };
  pinnedGames: any[]; // To be populated with Game types
};
