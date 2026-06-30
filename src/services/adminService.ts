import { adminRepository } from './adminRepository';
import { gameRepository } from './gameRepository';
import { profileRepository } from './profileRepository';

export const adminService = {
  async verifyAdmin(userId: string): Promise<boolean> {
    return adminRepository.isAdmin(userId);
  },

  async getPendingSubmissions(userId: string) {
    const isAdmin = await adminRepository.isAdmin(userId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    return adminRepository.getPendingSubmissions();
  },

  async approveSubmission(userId: string, submissionId: string, genre: string) {
    const isAdmin = await adminRepository.isAdmin(userId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const submission = await adminRepository.getSubmissionById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'Pending') {
      throw new Error('Submission has already been reviewed');
    }

    const adminProfile = await profileRepository.getByUserId(userId);
    if (!adminProfile) {
      throw new Error('Admin profile not found');
    }

    // 1. Insert the game into the game_catalog
    const slug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Generate a unique negative IGDB ID for manual submissions to avoid collisions
    const tempIgdbId = -Math.floor(100000 + Math.random() * 900000);

    const newGame = await gameRepository.upsertGame({
      igdb_id: tempIgdbId,
      slug,
      title: submission.title,
      cover_url: null, // manual uploads start with default covers in V1
      genre: genre,
      platform: submission.platform || 'PC',
      release_year: submission.release_year,
      developer: null,
      summary: 'Manually submitted game.',
    });

    // 2. Update submission status
    await adminRepository.updateSubmissionStatus(submissionId, 'Approved', 'Approved and added to catalog.');

    // 3. Log the action
    await adminRepository.logAdminAction(
      adminProfile.id,
      'Approved Game',
      'Manual Submission',
      submissionId,
      { title: submission.title, catalogId: newGame.id }
    );

    return newGame;
  },

  async rejectSubmission(userId: string, submissionId: string, reason: string) {
    const isAdmin = await adminRepository.isAdmin(userId);
    if (!isAdmin) {
      throw new Error('Unauthorized: Admin access required');
    }

    const submission = await adminRepository.getSubmissionById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    if (submission.status !== 'Pending') {
      throw new Error('Submission has already been reviewed');
    }

    const adminProfile = await profileRepository.getByUserId(userId);
    if (!adminProfile) {
      throw new Error('Admin profile not found');
    }

    // 1. Update status
    await adminRepository.updateSubmissionStatus(submissionId, 'Rejected', reason);

    // 2. Log action
    await adminRepository.logAdminAction(
      adminProfile.id,
      'Rejected Game',
      'Manual Submission',
      submissionId,
      { title: submission.title, reason }
    );
  },
};
