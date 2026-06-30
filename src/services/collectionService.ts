import { collectionRepository } from './collectionRepository';

export const collectionService = {
  async getCollections(profileId: string) {
    return collectionRepository.listByProfileId(profileId);
  },

  async getCollection(collectionId: string) {
    const collection = await collectionRepository.getById(collectionId);
    if (!collection) return null;

    const games = await collectionRepository.getGames(collectionId);
    return {
      collection,
      games,
    };
  },

  async createCollection(profileId: string, name: string, description: string | null = null) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Collection name is required');
    }

    if (trimmedName.length > 100) {
      throw new Error('Collection name cannot exceed 100 characters');
    }

    if (description && description.length > 250) {
      throw new Error('Description cannot exceed 250 characters');
    }

    // Enforce maximum 10 collections per user
    const currentCount = await collectionRepository.countByProfileId(profileId);
    if (currentCount >= 10) {
      throw new Error('Maximum limit of 10 collections reached');
    }

    return collectionRepository.create(profileId, trimmedName, description);
  },

  async updateCollection(collectionId: string, profileId: string, name?: string, description?: string | null) {
    const updates: Record<string, any> = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error('Collection name is required');
      }
      if (trimmedName.length > 100) {
        throw new Error('Collection name cannot exceed 100 characters');
      }
      updates.name = trimmedName;
    }

    if (description !== undefined) {
      if (description && description.length > 250) {
        throw new Error('Description cannot exceed 250 characters');
      }
      updates.description = description;
    }

    return collectionRepository.update(collectionId, profileId, updates);
  },

  async deleteCollection(collectionId: string, profileId: string) {
    return collectionRepository.delete(collectionId, profileId);
  },

  async addGameToCollection(profileId: string, collectionId: string, gameId: string) {
    // Verify collection ownership
    const collection = await collectionRepository.getById(collectionId);
    if (!collection || collection.profile_id !== profileId) {
      throw new Error('Unauthorized or collection not found');
    }

    return collectionRepository.addGame(collectionId, gameId);
  },

  async removeGameFromCollection(profileId: string, collectionId: string, gameId: string) {
    // Verify collection ownership
    const collection = await collectionRepository.getById(collectionId);
    if (!collection || collection.profile_id !== profileId) {
      throw new Error('Unauthorized or collection not found');
    }

    return collectionRepository.removeGame(collectionId, gameId);
  },
};
export type { CollectionWithGamesCount } from './collectionRepository';
