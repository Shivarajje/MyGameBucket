import { Visibility } from '../constants/enums';
import { Game } from './game';

export type Collection = {
  id: string;
  profileId: string;
  name: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

export type CollectionWithGames = Collection & {
  games: {
    addedAt: string;
    game: Game;
  }[];
  coverPreviewUrl?: string; // Auto-generated collage preview
};
