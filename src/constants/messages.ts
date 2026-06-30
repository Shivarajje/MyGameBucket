export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Account created successfully. Welcome to MyGameBucket.',
    LOGIN_SUCCESS: 'Welcome back.',
    LOGOUT_SUCCESS: 'You have been logged out.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_TAKEN: 'This email is already registered.',
    USERNAME_TAKEN: 'This username is already taken.',
  },
  LIBRARY: {
    ADD_SUCCESS: 'Game added to your library.',
    UPDATE_SUCCESS: 'Library entry updated.',
    REMOVE_SUCCESS: 'Game removed from your library.',
    ALREADY_EXISTS: 'This game is already in your library.',
  },
  PROFILE: {
    UPDATE_SUCCESS: 'Profile updated successfully.',
    AVATAR_SUCCESS: 'Avatar updated successfully.',
    PIN_SUCCESS: 'Pinned games updated.',
    PIN_LIMIT: 'You can only pin up to 3 games.',
  },
  JOURNAL: {
    SAVE_SUCCESS: 'Journal entry saved.',
    DELETE_SUCCESS: 'Journal entry deleted.',
  },
  COLLECTIONS: {
    CREATE_SUCCESS: 'Collection created.',
    UPDATE_SUCCESS: 'Collection updated.',
    DELETE_SUCCESS: 'Collection deleted.',
    ADD_GAME_SUCCESS: 'Game added to collection.',
    REMOVE_GAME_SUCCESS: 'Game removed from collection.',
    LIMIT_REACHED: 'You can only have up to 10 collections.',
  },
  GENERIC: {
    ERROR: 'An unexpected error occurred. Please try again.',
    SAVED: 'Changes saved.',
  }
};
