import { journalRepository } from './journalRepository';

// Basic HTML sanitization helper
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .trim();
}

export const journalService = {
  async getEntry(profileId: string, gameId: string) {
    return journalRepository.getByGameId(profileId, gameId);
  },

  async getUserJournal(profileId: string) {
    return journalRepository.getByProfileId(profileId);
  },

  async saveEntry(profileId: string, gameId: string, entryText: string) {
    const sanitized = sanitizeInput(entryText);

    if (!sanitized) {
      throw new Error('Journal entry cannot be empty');
    }

    if (sanitized.length > 280) {
      throw new Error('Journal entry cannot exceed 280 characters');
    }

    return journalRepository.upsert({
      profile_id: profileId,
      game_id: gameId,
      entry: sanitized,
    });
  },

  async deleteEntry(profileId: string, gameId: string) {
    return journalRepository.delete(profileId, gameId);
  },
};
export type { JournalEntryWithGame } from './journalRepository';
