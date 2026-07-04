import { GenreCategory } from '@/constants/enums';
import { mapIgdbGenreToCategory } from '@/lib/genre-mapper';

/**
 * Splits a comma-separated genre string, maps each genre to our internal
 * GenreCategory enum using the mapper, and returns one at random.
 */
export function getRandomGenreTheme(genreString?: string | null): GenreCategory | null {
  if (!genreString) return null;
  const parts = genreString.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  
  const mappedGenres = parts.map((p) => mapIgdbGenreToCategory(p));
  const randomIndex = Math.floor(Math.random() * mappedGenres.length);
  return mappedGenres[randomIndex];
}
