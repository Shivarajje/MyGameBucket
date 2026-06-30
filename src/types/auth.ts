export type AuthUser = {
  id: string;
  email: string;
};

export type Session = {
  user: AuthUser | null;
  accessToken: string | null;
};
