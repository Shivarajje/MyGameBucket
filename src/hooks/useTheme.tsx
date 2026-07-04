'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AppearanceMode, GenreCategory } from '@/constants/enums';
import { GENRE_THEMES } from '@/config/theme';

type ThemeContextType = {
  theme: AppearanceMode;
  setTheme: (theme: AppearanceMode) => void;
  genreTheme: GenreCategory | null;
  setGenreTheme: (genre: GenreCategory | null) => void;
  profileGenre: GenreCategory | null;
  setProfileGenre: (genre: GenreCategory | null) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppearanceMode>(AppearanceMode.Dark);
  const [genreTheme, setGenreTheme] = useState<GenreCategory | null>(null);
  const [profileGenre, setProfileGenre] = useState<GenreCategory | null>(null);

  useEffect(() => {
    // Initial load: dark is default, but check if light is forced elsewhere (e.g. settings)
    const stored = localStorage.getItem('theme') as AppearanceMode | null;
    if (stored === AppearanceMode.Light) {
      setTimeout(() => {
        setThemeState(AppearanceMode.Light);
      }, 0);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    async function loadFavoriteGenre() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const profile = await res.json();
          if (profile?.favorite_genre) {
            const favGenre = profile.favorite_genre as GenreCategory;
            setGenreTheme(favGenre);
            setProfileGenre(favGenre);
          }
        }
      } catch {
        // Guest user or error, do nothing
      }
    }
    loadFavoriteGenre();
  }, []);

  const setTheme = (newTheme: AppearanceMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === AppearanceMode.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Apply genre-specific CSS variables to the root if a genre is selected
    if (genreTheme && GENRE_THEMES[genreTheme]) {
      const palette = GENRE_THEMES[genreTheme];
      document.documentElement.style.setProperty('--primary', palette.primary);
      document.documentElement.style.setProperty('--accent', palette.accent);
      document.documentElement.style.setProperty('--border', palette.border);
    } else {
      // Clear genre overrides
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--border');
    }
  }, [genreTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      genreTheme, 
      setGenreTheme, 
      profileGenre, 
      setProfileGenre 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
