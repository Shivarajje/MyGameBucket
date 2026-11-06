import { GenreCategory } from '@/constants/enums';
import { mapIgdbGenreToCategory } from '@/lib/genre-mapper';

/**
 * Splits a comma-separated genre string, maps each genre to our internal
 * GenreCategory enum using the mapper, and returns the primary genre.
 * Uses deterministic selection (primary genre) to prevent SSR hydration mismatch.
 */
export function getRandomGenreTheme(genreString?: string | null): GenreCategory | null {
  if (!genreString) return null;
  const parts = genreString.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  
  // Return the primary mapped genre deterministically so server HTML and client hydration match
  return mapIgdbGenreToCategory(parts[0]);
}
