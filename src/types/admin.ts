import { SubmissionStatus, LogLevel } from '../constants/enums';

export type AdminLog = {
  id: string;
  adminId: string;
  action: string;
  targetId: string | null;
  targetType: string | null;
  details: any;
  createdAt: string;
};

export type SystemLog = {
  id: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata: any;
  createdAt: string;
};

export type ManualGameSubmission = {
  id: string;
  submittedBy: string;
  title: string;
  platform: string | null;
  releaseYear: number | null;
  igdbUrl: string | null;
  status: SubmissionStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};
