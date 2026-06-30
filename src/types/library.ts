import { GameStatus } from '../constants/enums';
import { Game } from './game';

export type LibraryEntry = {
  id: string;
  profileId: string;
  gameId: string;
  status: GameStatus;
  hoursPlayed: number;
  rating: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  game?: Game;
};

export type LibraryFilters = {
  status?: GameStatus[];
  search?: string;
};

export type LibrarySortOption = 'date_added' | 'started_date' | 'name' | 'hours_played';
