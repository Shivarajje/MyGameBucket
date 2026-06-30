import { GenreCategory } from '../constants/enums';

export type ThemePalette = {
  primary: string;
  accent: string;
  border: string;
};

export const GENRE_THEMES: Record<GenreCategory, ThemePalette> = {
  [GenreCategory.RPG]: {
    primary: 'oklch(0.5 0.1 270)',
    accent: 'oklch(0.7 0.15 270)',
    border: 'oklch(0.4 0.1 270)',
  },
  [GenreCategory.Soulslike]: {
    primary: 'oklch(0.4 0.05 40)',
    accent: 'oklch(0.6 0.1 40)',
    border: 'oklch(0.3 0.05 40)',
  },
  [GenreCategory.Horror]: {
    primary: 'oklch(0.3 0.1 20)',
    accent: 'oklch(0.5 0.15 20)',
    border: 'oklch(0.25 0.1 20)',
  },
  [GenreCategory.Racing]: {
    primary: 'oklch(0.5 0.15 30)',
    accent: 'oklch(0.7 0.2 30)',
    border: 'oklch(0.4 0.15 30)',
  },
  [GenreCategory.Strategy]: {
    primary: 'oklch(0.5 0.1 220)',
    accent: 'oklch(0.7 0.15 220)',
    border: 'oklch(0.4 0.1 220)',
  },
  [GenreCategory.Simulation]: {
    primary: 'oklch(0.6 0.1 140)',
    accent: 'oklch(0.8 0.15 140)',
    border: 'oklch(0.5 0.1 140)',
  },
  [GenreCategory.Shooter]: {
    primary: 'oklch(0.5 0.1 100)',
    accent: 'oklch(0.7 0.15 100)',
    border: 'oklch(0.4 0.1 100)',
  },
  [GenreCategory.Adventure]: {
    primary: 'oklch(0.5 0.15 170)',
    accent: 'oklch(0.7 0.2 170)',
    border: 'oklch(0.4 0.15 170)',
  },
  [GenreCategory.Indie]: {
    primary: 'oklch(0.6 0.15 300)',
    accent: 'oklch(0.8 0.2 300)',
    border: 'oklch(0.5 0.15 300)',
  },
  [GenreCategory.Platformer]: {
    primary: 'oklch(0.6 0.15 60)',
    accent: 'oklch(0.8 0.2 60)',
    border: 'oklch(0.5 0.15 60)',
  },
  [GenreCategory.Cyberpunk]: {
    primary: 'oklch(0.6 0.2 320)',
    accent: 'oklch(0.8 0.25 320)',
    border: 'oklch(0.5 0.2 320)',
  },
  [GenreCategory.SciFi]: {
    primary: 'oklch(0.5 0.15 250)',
    accent: 'oklch(0.7 0.2 250)',
    border: 'oklch(0.4 0.15 250)',
  },
  [GenreCategory.Retro]: {
    primary: 'oklch(0.6 0.15 10)',
    accent: 'oklch(0.8 0.2 10)',
    border: 'oklch(0.5 0.15 10)',
  },
};
