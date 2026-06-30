import { GenreCategory } from '../constants/enums';

// Maps free-text IGDB genres to our internal Theme Engine categories
export function mapIgdbGenreToCategory(igdbGenre: string): GenreCategory {
  const normalized = igdbGenre.toLowerCase().trim();

  if (normalized.includes('role-playing') || normalized.includes('rpg') || normalized.includes('jrpg')) {
    return GenreCategory.RPG;
  }
  if (normalized.includes('soulslike')) {
    return GenreCategory.Soulslike;
  }
  if (normalized.includes('horror') || normalized.includes('survival horror')) {
    return GenreCategory.Horror;
  }
  if (normalized.includes('racing') || normalized.includes('driving')) {
    return GenreCategory.Racing;
  }
  if (normalized.includes('strategy') || normalized.includes('rts') || normalized.includes('turn-based')) {
    return GenreCategory.Strategy;
  }
  if (normalized.includes('simulator') || normalized.includes('simulation')) {
    return GenreCategory.Simulation;
  }
  if (normalized.includes('shooter') || normalized.includes('fps')) {
    return GenreCategory.Shooter;
  }
  if (normalized.includes('adventure') || normalized.includes('point-and-click')) {
    return GenreCategory.Adventure;
  }
  if (normalized.includes('indie')) {
    return GenreCategory.Indie;
  }
  if (normalized.includes('platform') || normalized.includes('metroidvania')) {
    return GenreCategory.Platformer;
  }
  if (normalized.includes('cyberpunk')) {
    return GenreCategory.Cyberpunk;
  }
  if (normalized.includes('sci-fi') || normalized.includes('science fiction')) {
    return GenreCategory.SciFi;
  }
  if (normalized.includes('retro') || normalized.includes('arcade')) {
    return GenreCategory.Retro;
  }

  // Fallback to Adventure if no clear match
  return GenreCategory.Adventure;
}
