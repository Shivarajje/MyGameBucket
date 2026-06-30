import { GenreCategory, UserRole } from '../constants/enums';

export type PinnedGame = {
  id: string;
  profileId: string;
  gameId: string;
  position: number;
  createdAt: string;
  game?: any; // Will be typed properly when Game type is defined
};

export type ThemeSettings = {
  accentColor: string;
  primaryColor: string;
};
