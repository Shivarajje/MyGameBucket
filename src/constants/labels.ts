import { GameStatus } from './enums';

export const STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatus.Playing]: 'Playing',
  [GameStatus.Completed]: 'Completed',
  [GameStatus.OnHold]: 'On Hold',
  [GameStatus.Dropped]: 'Dropped',
};
