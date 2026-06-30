import { Game } from './game';

export type JournalEntry = {
  id: string;
  profileId: string;
  gameId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  game?: Game;
};
