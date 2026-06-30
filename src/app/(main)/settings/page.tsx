'use client';

import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileEditForm } from '@/features/profile/components/ProfileEditForm';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { profile, loading, updateProfile } = useProfile();

  if (loading) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container className="max-w-2xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 rounded-3xl" />
        </Container>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 pt-28">
        <h2 className="text-lg font-semibold">Not signed in</h2>
        <p className="text-sm text-muted-foreground">Please log in to access settings.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container className="max-w-2xl">
        <PageHeader title="Settings" subtitle="Manage your profile and preferences" />
        <div className="mt-8">
          <ProfileEditForm profile={profile} onSave={updateProfile} />
        </div>
      </Container>
    </main>
  );
}
