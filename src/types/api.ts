export type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
  status: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  error: ApiError | null;
  status: number;
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    hasMore: boolean;
  };
};

export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
};
