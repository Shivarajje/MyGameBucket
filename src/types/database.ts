import { GameStatus, Visibility, AppearanceMode, UserRole, SubmissionStatus, LogLevel, GenreCategory } from '../constants/enums';

export type DatabaseProfile = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  favorite_game_id: string | null;
  favorite_genre: GenreCategory | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseUserRole = {
  id: string;
  profile_id: string;
  role: UserRole;
  created_at: string;
};

export type DatabaseGameCatalog = {
  id: string;
  igdb_id: number;
  slug: string;
  title: string;
  cover_url: string | null;
  genre: string | null;
  platform: string | null;
  release_year: number | null;
  developer: string | null;
  summary: string | null;
  last_synced_at: string;
  created_at: string;
};

export type DatabaseUserGame = {
  id: string;
  profile_id: string;
  game_id: string;
  status: GameStatus;
  hours_played: number;
  rating: number | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabasePinnedGame = {
  id: string;
  profile_id: string;
  game_id: string;
  position: number;
  created_at: string;
};

export type DatabaseJournalEntry = {
  id: string;
  profile_id: string;
  game_id: string;
  entry: string;
  created_at: string;
  updated_at: string;
};

export type DatabaseCollection = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseCollectionGame = {
  id: string;
  collection_id: string;
  game_id: string;
  created_at: string;
};

export type DatabaseSettings = {
  id: string;
  profile_id: string;
  appearance: AppearanceMode;
  reduced_motion: boolean;
  performance_mode: boolean;
  created_at: string;
  updated_at: string;
};

export type DatabaseManualGameSubmission = {
  id: string;
  submitted_by: string;
  title: string;
  platform: string | null;
  release_year: number | null;
  igdb_url: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DatabaseAdminLog = {
  id: string;
  admin_id: string;
  action: string;
  target_id: string | null;
  target_type: string | null;
  details: any;
  created_at: string;
};

export type DatabaseSystemLog = {
  id: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata: any;
  created_at: string;
};

// Generic Database wrapper type for Supabase clients
export type Database = any;
