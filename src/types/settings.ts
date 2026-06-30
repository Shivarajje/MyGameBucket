import { AppearanceMode } from '../constants/enums';

export type UserSettings = {
  id: string;
  profileId: string;
  appearance: AppearanceMode;
  reducedMotion: boolean;
  performanceMode: boolean;
  createdAt: string;
  updatedAt: string;
};
