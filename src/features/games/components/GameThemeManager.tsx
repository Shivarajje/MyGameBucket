'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getRandomGenreTheme } from '@/lib/theme-utils';

interface GameThemeManagerProps {
  genre?: string | null;
}

export function GameThemeManager({ genre }: GameThemeManagerProps) {
  const { setGenreTheme, profileGenre } = useTheme();

  useEffect(() => {
    // Select one of the game's genres at random and apply its theme
    const selectedGenre = getRandomGenreTheme(genre);
    if (selectedGenre) {
      setGenreTheme(selectedGenre);
    }

    return () => {
      // Clean up and restore the user's profile favorite theme when leaving the page
      setGenreTheme(profileGenre);
    };
  }, [genre, setGenreTheme, profileGenre]);

  return null;
}
