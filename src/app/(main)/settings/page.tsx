'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProfileEditForm } from '@/features/profile/components/ProfileEditForm';
import { ThemeSettings } from '@/features/profile/components/ThemeSettings';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ROUTES } from '@/constants/routes';

export default function SettingsPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const { profile, loading, updateProfile } = useProfile();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push(ROUTES.LOGIN);
      } else {
        setAuthChecking(false);
      }
    });
  }, [router]);

  if (authChecking || loading || !profile) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container className="max-w-2xl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 rounded-3xl" />
        </Container>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container className="max-w-5xl">
        <PageHeader title="Settings" subtitle="Manage your profile and preferences" />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <ProfileEditForm profile={profile} onSave={updateProfile} />
          <ThemeSettings />
        </div>
      </Container>
    </main>
  );
}
